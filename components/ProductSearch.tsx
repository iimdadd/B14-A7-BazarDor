
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

type ProductSearchProps = {
  products: Product[];
};

export default function ProductSearch({
  products,
}: ProductSearchProps) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("bn");

    if (!query) return products;

    return products.filter((product) =>
      product.nameBn.toLocaleLowerCase("bn").includes(query)
    );
  }, [products, search]);

  function toBengaliNumber(value: number) {
    return value.toLocaleString("bn-BD");
  }

  return (
    <div>
      <label
        htmlFor="product-search"
        className="mb-3 block text-sm font-bold text-gray-700"
      >
        পণ্যের নাম লিখে খুঁজুন
      </label>

      <div className="relative">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl"
        >
          🔎
        </span>

        <input
          id="product-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="যেমন: চাল, ডাল, মাছ..."
          className="w-full rounded-2xl border border-[#dfe6d6] bg-white py-4 pl-12 pr-12 text-base text-[#17251c] outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="সার্চ মুছে ফেলুন"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            মুছুন
          </button>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-500" aria-live="polite">
        {toBengaliNumber(filteredProducts.length)}টি পণ্য পাওয়া গেছে
      </p>

      {filteredProducts.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {filteredProducts.map((product) => {
            const changeColor =
              product.change.dir === "up"
                ? "bg-red-50 text-red-700"
                : product.change.dir === "down"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-600";

            const changeIcon =
              product.change.dir === "up"
                ? "↑"
                : product.change.dir === "down"
                  ? "↓"
                  : "→";

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-[#e8ecdf] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-xl sm:p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-[#f2f6e9] text-3xl sm:size-16 sm:text-4xl">
                    {product.image}
                  </span>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${changeColor}`}
                  >
                    {changeIcon}{" "}
                    {toBengaliNumber(Math.abs(product.change.pct))}%
                  </span>
                </div>

                <h3 className="mt-4 font-extrabold text-[#17251c]">
                  {product.nameBn}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  প্রতি {product.unit}
                </p>

                <p className="mt-4 text-xl font-black text-[#17251c]">
                  ৳{toBengaliNumber(product.today)}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  গতকাল: ৳{toBengaliNumber(product.yesterday)}
                </p>

                <p className="mt-4 font-bold text-green-700">
                  বিস্তারিত দেখুন →
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center">
          <span className="text-4xl">🔎</span>
          <p className="mt-3 font-bold text-[#17251c]">
            কোনো পণ্য পাওয়া যায়নি
          </p>
          <p className="mt-2 text-sm text-gray-500">
            অন্য নামে সার্চ করে দেখুন।
          </p>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="mt-4 rounded-full bg-[#ccff00] px-5 py-2 font-bold text-[#17251c] hover:bg-[#b7e600]"
          >
            সব পণ্য দেখুন
          </button>
        </div>
      )}
    </div>
  );
}
