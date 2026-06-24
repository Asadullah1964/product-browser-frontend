import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const API = "https://product-browser-backend.onrender.com/api/products";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [category, setCategory] = useState("");
    const [loadingMore, setLoadingMore] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        image: "",
    });

    const [editId, setEditId] = useState(null);

    const loadProducts = async (reset = false) => {
        try {
            setLoadingMore(true);

            let url = API + "?limit=20";

            if (category) {
                url += `&category=${category}`;
            }

            if (cursor && !reset) {
                url += `&cursorCreatedAt=${cursor.createdAt}&cursorId=${cursor.id}`;
            }

            const res = await axios.get(url);

            if (reset) {
                setProducts(res.data.data);
            } else {
                setProducts((prev) => [...prev, ...res.data.data]);
            }

            setCursor(res.data.nextCursor);
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        setProducts([]);
        setCursor(null);
        loadProducts(true);
    }, [category]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            if (editId) {
                await axios.put(`${API}/${editId}`, form);
            } else {
                await axios.post(API, form);
            }

            setForm({
                name: "",
                category: "",
                price: "",
                image: "",
            });

            setEditId(null);
            setProducts([]);
            setCursor(null);
            loadProducts(true);
        } catch (error) {
            console.error("Error saving product:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const deleteProduct = async (id) => {
        try {
            console.log("Deleting ID:", id);
            console.log("Delete URL:", `${API}/${id}`);

            await axios.delete(`${API}/${id}`);

            setProducts((prev) => prev.filter((p) => p._id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
            console.error("Response data:", error.response?.data);
            console.error("Status:", error.response?.status);
        }
    };

    const editProduct = (product) => {
        setEditId(product._id);
        setForm({
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setEditId(null);
        setForm({
            name: "",
            category: "",
            price: "",
            image: "",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                            Admin panel
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Product Manager
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                            Create, update, filter, and manage your catalog from one clean dashboard.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Total loaded
                            </p>
                            <p className="mt-2 text-2xl font-bold">{products.length}</p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Mode
                            </p>
                            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                                {editId ? "Editing" : "Creating"}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Filter
                            </p>
                            <p className="mt-2 text-sm font-semibold capitalize text-gray-900 dark:text-white">
                                {category || "All categories"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {editId ? "Edit product" : "Add new product"}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Fill in product details and keep your catalog updated.
                                </p>
                            </div>

                            {editId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    Cancel edit
                                </button>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Product name
                                </label>
                                <input
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                                    placeholder="Enter product name"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category
                                </label>
                                <input
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                                    placeholder="electronics / fashion / gaming"
                                    value={form.category}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            category: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Price
                                </label>
                                <input
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                                    placeholder="Enter price"
                                    type="number"
                                    value={form.price}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            price: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Image URL
                                </label>
                                <input
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                                    placeholder="Paste product image URL"
                                    value={form.image}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            image: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            >
                                {submitting
                                    ? editId
                                        ? "Updating..."
                                        : "Adding..."
                                    : editId
                                        ? "Update Product"
                                        : "Add Product"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                                Reset
                            </button>
                        </div>
                    </form>

                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <h2 className="text-xl font-semibold">Filter products</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Narrow your product grid by category.
                        </p>

                        <div className="mt-5 space-y-3">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                            >
                                <option value="">All categories</option>
                                <option value="electronics">electronics</option>
                                <option value="fashion">fashion</option>
                                <option value="gaming">gaming</option>
                                <option value="books">books</option>
                            </select>

                            <div className="flex flex-wrap gap-2">
                                {["", "electronics", "fashion", "gaming", "books"].map((item) => (
                                    <button
                                        key={item || "all"}
                                        type="button"
                                        onClick={() => setCategory(item)}
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === item
                                            ? "bg-black text-white dark:bg-white dark:text-black"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        {item || "All"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl bg-gray-50 p-4 dark:bg-gray-950">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Current action
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {editId
                                    ? "You are editing an existing product. Save changes when done."
                                    : "You are in create mode. Add a new product using the form."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">Product list</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Manage catalog items with edit and delete actions.
                        </p>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
                        <h3 className="text-lg font-semibold">No products found</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Try another category or add a new product.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                editProduct={editProduct}
                                deleteProduct={deleteProduct}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-10 flex justify-center">
                    <button
                        onClick={() => loadProducts(false)}
                        disabled={!cursor || loadingMore}
                        className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loadingMore ? "Loading..." : cursor ? "Load More" : "No More Products"}
                    </button>
                </div>
            </div>
        </div>
    );
}