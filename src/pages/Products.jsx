import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const API = "https://product-browser-backend.onrender.com/api/products";

const CATEGORY_OPTIONS = ["electronics", "fashion", "gaming", "books"];

export default function Products() {
    const [products, setProducts] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [category, setCategory] = useState("");
    const [loadingMore, setLoadingMore] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [bulkGenerating, setBulkGenerating] = useState(false);
    const [bulkProgress, setBulkProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState("");

    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        image: "",
    });

    const [editId, setEditId] = useState(null);

    const updateForm = (key, value) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
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

    const loadProducts = async (reset = false, selectedCategory = category) => {
        try {
            if (reset) {
                setInitialLoading(true);
            } else {
                setLoadingMore(true);
            }

            let url = API + "?limit=20";

            if (selectedCategory) {
                url += `&category=${selectedCategory}`;
            }

            const activeCursor = reset ? null : cursor;

            if (activeCursor) {
                url += `&cursorCreatedAt=${activeCursor.createdAt}&cursorId=${activeCursor.id}`;
            }

            const res = await axios.get(url);

            if (reset) {
                setProducts(res.data.data || []);
            } else {
                setProducts((prev) => [...prev, ...(res.data.data || [])]);
            }

            setCursor(res.data.nextCursor || null);
        } catch (error) {
            console.error("Error loading products:", error);
            setStatusMessage("Unable to load products right now.");
        } finally {
            setLoadingMore(false);
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        setProducts([]);
        setCursor(null);
        loadProducts(true, category);
    }, [category]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setStatusMessage("");

            const payload = {
                ...form,
                price: Number(form.price),
            };

            if (editId) {
                await axios.put(`${API}/${editId}`, payload);
                setStatusMessage("Product updated successfully.");
            } else {
                await axios.post(API, payload);
                setStatusMessage("Product created successfully.");
            }

            resetForm();
            setProducts([]);
            setCursor(null);
            await loadProducts(true, category);
        } catch (error) {
            console.error("Error saving product:", error);
            setStatusMessage("Failed to save product.");
        } finally {
            setSubmitting(false);
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${API}/${id}`);
            setProducts((prev) => prev.filter((p) => p._id !== id));
            setStatusMessage("Product deleted successfully.");
        } catch (error) {
            console.error("Error deleting product:", error);
            console.error("Response data:", error.response?.data);
            console.error("Status:", error.response?.status);
            setStatusMessage("Failed to delete product.");
        }
    };

    const editProduct = (product) => {
        setEditId(product._id);
        setForm({
            name: product.name || "",
            category: product.category || "",
            price: product.price || "",
            image: product.image || "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const generateProducts = async () => {
        try {
            setBulkGenerating(true);
            setBulkProgress(0);
            setBulkStatus("Starting bulk generation...");

            const categories = ["electronics", "fashion", "gaming", "books"];
            const totalProducts = 200000;
            const chunkSize = 5000;
            const totalChunks = Math.ceil(totalProducts / chunkSize);

            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                const products = [];
                const start = chunkIndex * chunkSize;
                const end = Math.min(start + chunkSize, totalProducts);

                for (let i = start; i < end; i++) {
                    products.push({
                        name: `Product ${i + 1}`,
                        category: categories[Math.floor(Math.random() * categories.length)],
                        price: Math.floor(Math.random() * 100000),
                        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661",
                        created_at: new Date(),
                        updated_at: new Date(),
                    });
                }

                setBulkStatus(`Uploading batch ${chunkIndex + 1} of ${totalChunks}...`);

                await axios.post(API + "/bulk", { products });

                setBulkProgress(Math.round(((chunkIndex + 1) / totalChunks) * 100));
            }

            setBulkStatus("Inserted 200,000 products successfully.");
            setProducts([]);
            setCursor(null);
            loadProducts(true);
        } catch (error) {
            console.error("Error generating bulk products:", error);
            setBulkStatus("Bulk insert failed.");
        } finally {
            setBulkGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                            Admin panel
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Product Manager
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                            Manage products, test large-scale inserts, and browse paginated
                            catalog results from one clean dashboard.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                                Loaded now
                            </p>
                            <p className="mt-2 text-2xl font-bold tabular-nums">
                                {products.length}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Current batch visible
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                                Editor mode
                            </p>
                            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                                {editId ? "Editing existing product" : "Creating new product"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Form state changes here
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                                Active filter
                            </p>
                            <p className="mt-2 text-sm font-semibold capitalize text-gray-900 dark:text-white">
                                {category || "All categories"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Server-side filtered
                            </p>
                        </div>
                    </div>
                </div>

                {statusMessage ? (
                    <div className="mb-6 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
                        {statusMessage}
                    </div>
                ) : null}

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
                                    Use this form for single-product create and update actions.
                                </p>
                            </div>

                            {editId ? (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={submitting || bulkGenerating}
                                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    Cancel edit
                                </button>
                            ) : null}
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
                                    onChange={(e) => updateForm("name", e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Category
                                </label>
                                <select
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                                    value={form.category}
                                    onChange={(e) => updateForm("category", e.target.value)}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {CATEGORY_OPTIONS.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Price
                                </label>
                                <input
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                                    placeholder="Enter price"
                                    type="number"
                                    min="0"
                                    value={form.price}
                                    onChange={(e) => updateForm("price", e.target.value)}
                                    required
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
                                    onChange={(e) => updateForm("image", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="submit"
                                disabled={submitting || bulkGenerating}
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
                                disabled={submitting || bulkGenerating}
                                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                            >
                                Reset
                            </button>
                        </div>
                    </form>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <h2 className="text-xl font-semibold">Filter products</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Narrow visible results with category-based server filtering.
                            </p>

                            <div className="mt-5 space-y-3">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-black focus:ring-4 focus:ring-black/5 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                                >
                                    <option value="">All categories</option>
                                    {CATEGORY_OPTIONS.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>

                                <div className="flex flex-wrap gap-2">
                                    {["", ...CATEGORY_OPTIONS].map((item) => (
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

                        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/30">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-200">
                                        Bulk tools
                                    </h2>
                                    <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-300/80">
                                        Insert 200,000 demo records in batches for testing large
                                        catalog performance.
                                    </p>
                                </div>

                                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                                    Heavy action
                                </span>
                            </div>

                            <div className="mt-4 rounded-2xl border border-amber-200/70 bg-white/70 p-4 dark:border-amber-900/40 dark:bg-black/20">
                                <p className="text-sm text-amber-900 dark:text-amber-100">
                                    Recommended only for seed or stress-test environments. This
                                    action may take time depending on backend speed.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={generateProducts}
                                disabled={bulkGenerating || submitting}
                                className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {bulkGenerating ? "Generating 200k..." : "Generate 200k Products"}
                            </button>

                            {(bulkGenerating || bulkProgress > 0) && (
                                <div className="mt-4 rounded-2xl border border-amber-200/80 bg-white/80 p-4 dark:border-amber-900/40 dark:bg-black/20">
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <p className="text-sm text-amber-900 dark:text-amber-100">
                                            {bulkGenerating
                                                ? statusMessage || "Bulk generation in progress..."
                                                : "Bulk action completed."}
                                        </p>
                                        <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                                            {bulkProgress}%
                                        </span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-amber-100 dark:bg-amber-900/40">
                                        <div
                                            className="h-full rounded-full bg-amber-500 transition-all duration-300"
                                            style={{ width: `${bulkProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">Product list</h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Showing paginated catalog results with edit and delete actions.
                        </p>
                    </div>

                    <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        Visible now: {products.length}
                    </div>
                </div>

                {initialLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                            >
                                <div className="h-44 animate-pulse bg-gray-200 dark:bg-gray-800" />
                                <div className="space-y-3 p-5">
                                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                                    <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
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
                        disabled={!cursor || loadingMore || bulkGenerating}
                        className="rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        {loadingMore
                            ? "Loading more products..."
                            : cursor
                                ? "Load More Results"
                                : "No More Results"}
                    </button>
                </div>
            </div>
        </div>
    );
}