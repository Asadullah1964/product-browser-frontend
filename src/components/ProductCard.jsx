export default function ProductCard({
    product,
    editProduct,
    deleteProduct,
}) {
    return (
        <article
            className="
        group overflow-hidden rounded-2xl border border-gray-200
        bg-white shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        dark:border-gray-800 dark:bg-gray-900
      "
        >
            <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                    src={product.image}
                    alt={product.name}
                    className="
            h-52 w-full object-cover
            transition duration-500 group-hover:scale-105
          "
                />

                <div className="absolute left-4 top-4">
                    <span
                        className="
              rounded-full bg-white/90 px-3 py-1
              text-xs font-semibold capitalize text-gray-700
              shadow-sm backdrop-blur
              dark:bg-black/60 dark:text-gray-200
            "
                    >
                        {product.category}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                        <h2 className="line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white">
                            {product.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Product ready for update or removal.
                        </p>
                    </div>
                </div>

                <div className="mb-5 flex items-center justify-between">
                    <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                        ₹ {product.price}
                    </p>

                    <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        In stock
                    </span>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => editProduct(product)}
                        className="
              flex-1 rounded-xl border border-gray-300
              bg-gray-50 px-4 py-2.5
              text-sm font-medium text-gray-700
              transition hover:bg-gray-100
              focus:outline-none focus:ring-2 focus:ring-gray-300
              dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700
            "
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => deleteProduct(product._id)}
                        className="
              flex-1 rounded-xl bg-red-500 px-4 py-2.5
              text-sm font-medium text-white
              transition hover:bg-red-600
              focus:outline-none focus:ring-2 focus:ring-red-300
              dark:bg-red-600 dark:hover:bg-red-700
            "
                    >
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
}