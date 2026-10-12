
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getProductsByCategory } from "@/lib/api";

export const instant = false;

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

type Category = {
  id?: number | string;
  slug: string;
  nameBn: string;
  icon: string;
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

function bn(value: number) {
  return value.toLocaleString("bn-BD");
}

function ProductCard({ product }: { product: Product }) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-green-600 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-4xl">{product.image}</span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            isUp
              ? "bg-green-100 text-green-700"
              : isDown
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-600"
          }`}
        >
          {isUp ? "▲" : isDown ? "▼" : "●"}{" "}
          {bn(Math.abs(product.change.pct))}%
        </span>
      </div>

      <h2 className="mt-4 text-lg font-bold">{product.nameBn}</h2>
      <p className="mt-1 text-sm text-gray-500">প্রতি {product.unit}</p>
      <p className="mt-4 text-2xl font-black">৳{bn(product.today)}</p>
      <p className="mt-2 text-sm text-gray-500">
        গতকাল: ৳{bn(product.yesterday)}
      </p>
      <p className="mt-4 font-bold text-green-700">বিস্তারিত দেখুন →</p>
    </Link>
  );
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort = "default" } = await searchParams;

  let category: Category | undefined;
  let products: Product[] = [];

  try {
    const [categoriesResult, productsResult] = await Promise.all([
      getCategories(),
      getProductsByCategory(slug),
    ]);

    const categories: Category[] = Array.isArray(categoriesResult)
      ? categoriesResult
      : Array.isArray(categoriesResult?.data)
        ? categoriesResult.data
        : [];

    products = Array.isArray(productsResult)
      ? productsResult
      : Array.isArray(productsResult?.data)
        ? productsResult.data
        : [];

    category = categories.find((item) => item.slug === slug);
  } catch {
    notFound();
  }

  if (!category) {
    notFound();
  }

  const sortedProducts = [...products];

  if (sort === "price-asc") {
    sortedProducts.sort((a, b) => a.today - b.today);
  } else if (sort === "price-desc") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  return (
    <main className="min-h-screen bg-[#f7f8f2] text-[#17251c]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5">
          <Link href="/" className="text-2xl font-black">
            🛒 বাজার দর
          </Link>
          <Link
            href="/"
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100"
          >
            ← হোম
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <p className="font-bold text-green-700">পণ্যের ক্যাটাগরি</p>

        <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">
              {category.icon} {category.nameBn}
            </h1>
            <p className="mt-3 text-gray-600">
              এই ক্যাটাগরির সব পণ্যের বর্তমান বাজারদর দেখুন।
            </p>
          </div>

          <form className="flex flex-col gap-2 sm:min-w-56">
            <label htmlFor="sort" className="text-sm font-semibold">
              দামের ভিত্তিতে সাজান
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-asc">কম দাম থেকে বেশি</option>
              <option value="price-desc">বেশি দাম থেকে কম</option>
            </select>
            <button
              type="submit"
              className="rounded-xl bg-[#ccff00] px-4 py-3 font-bold hover:bg-[#b7e600]"
            >
              সাজান
            </button>
          </form>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          মোট {bn(sortedProducts.length)}টি পণ্য
        </p>

        {sortedProducts.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center">
            <p className="text-lg font-bold">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex rounded-full bg-[#ccff00] px-6 py-3 font-bold hover:bg-[#b7e600]"
            >
              হোমে ফিরে যান
            </Link>
          </div>
        )}
      </section>

      <footer className="bg-[#17251c] px-4 py-8 text-center text-sm text-gray-300">
        <p className="font-bold text-white">🛒 বাজার দর</p>
        <p className="mt-2">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </footer>
    </main>
  );
}
