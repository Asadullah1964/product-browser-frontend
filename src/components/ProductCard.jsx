export default function ProductCard({ product }) {
    return (
        <div
            className="
        group
        overflow-hidden
        rounded-2xl
        border border-gray-200
        bg-white
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-xl
        dark:border-gray-800
        dark:bg-gray-900
      "
        >
            <div
                className="
          flex h-44 items-center justify-center
          bg-gradient-to-br from-gray-100 to-gray-200
          text-sm font-medium text-gray-500
          dark:from-gray-800 dark:to-gray-700 dark:text-gray-400
        "
            >
                <img src={product.image} alt="image" />
            </div>

            <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <h2
                        className="
              line-clamp-2
              text-lg font-semibold text-gray-900
              dark:text-white
            "
                    >
                        {product.name}
                    </h2>

                    <span
                        className="
              shrink-0 rounded-full
              bg-gray-100 px-3 py-1
              text-xs font-medium capitalize text-gray-700
              dark:bg-gray-800 dark:text-gray-300
            "
                    >
                        {product.category}
                    </span>
                </div>

                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Curated product from the {product.category} collection.
                </p>

                <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold tracking-tight text-green-600 dark:text-green-400">
                        ₹ {product.price}
                    </p>

                    <button
                        className="
              rounded-xl bg-black px-4 py-2
              text-sm font-medium text-white
              transition hover:bg-gray-800
              dark:bg-white dark:text-black dark:hover:bg-gray-200
            "
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
    );
}