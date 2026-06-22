import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const API = "https://product-browser-backend.onrender.com/api/products";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const loadProducts = async (reset = false, selectedCategory = category) => {
        try {
            setLoading(true);

            let url = API + "?limit=20";

            if (selectedCategory) {
                url += `&category=${selectedCategory}`;
            }

            if (!reset && cursor) {
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
            console.error("Failed to load products:", error);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        setProducts([]);
        setCursor(null);
        setInitialLoading(true);
        loadProducts(true, category);
    }, [category]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-white">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                            Browse collection
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Product Browser
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                            Explore products by category with smooth pagination and a cleaner shopping-style interface.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <select
                            className="
                rounded-xl border border-gray-300 bg-white px-4 py-3
                text-sm font-medium text-gray-700 shadow-sm outline-none
                transition focus:border-black focus:ring-2 focus:ring-black/10
                dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200
                dark:focus:border-white dark:focus:ring-white/10
              "
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="gaming">Gaming</option>
                            <option value="books">Books</option>
                        </select>
                    </div>
                </div>

                <div
                    className="
            mb-6 rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm
            backdrop-blur dark:border-gray-800 dark:bg-gray-900/80
          "
                >
                    <div className="flex flex-wrap items-center gap-3">
                        {["", "electronics", "fashion", "gaming", "books"].map((item) => (
                            <button
                                key={item || "all"}
                                onClick={() => setCategory(item)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === item
                                        ? "bg-black text-white dark:bg-white dark:text-black"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {item === "" ? "All" : item.charAt(0).toUpperCase() + item.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {initialLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="
                  animate-pulse overflow-hidden rounded-2xl
                  border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900
                "
                            >
                                <div className="h-44 bg-gray-200 dark:bg-gray-800" />
                                <div className="space-y-3 p-5">
                                    <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
                                    <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
                                    <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div
                        className="
              rounded-2xl border border-dashed border-gray-300
              bg-white p-12 text-center shadow-sm
              dark:border-gray-700 dark:bg-gray-900
            "
                    >
                        <h2 className="text-xl font-semibold">No products found</h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Try switching the category filter to view more products.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Showing <span className="font-semibold text-gray-900 dark:text-white">{products.length}</span> products
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        <div className="mt-10 flex justify-center">
                            <button
                                className="
                  rounded-2xl bg-black px-6 py-3
                  text-sm font-semibold text-white
                  transition hover:bg-gray-800
                  disabled:cursor-not-allowed disabled:opacity-50
                  dark:bg-white dark:text-black dark:hover:bg-gray-200
                "
                                onClick={() => loadProducts(false)}
                                disabled={loading || !cursor}
                            >
                                {loading ? "Loading..." : cursor ? "Load More" : "No More Products"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}