
import Link from "next/link";
import { getProducts } from "@/lib/api";

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


const categories = [
  { name: "চাল", icon: "🍚", slug: "chal" },
  { name: "ডাল", icon: "🫘", slug: "dal" },
  { name: "তেল", icon: "🛢️", slug: "tel" },
  { name: "সবজি", icon: "🥬", slug: "sobji" },
  { name: "মাছ", icon: "🐟", slug: "mach" },
  { name: "মাংস", icon: "🍗", slug: "mangsho" },
  { name: "ডিম-দুধ", icon: "🥛", slug: "dim-dui" },
  { name: "মসলা", icon: "🌶️", slug: "mosla" },
];

function toBengaliNumber(value: number) {
  return value.toLocaleString("bn-BD");
}

function ProductCard({ product }: { product: Product }) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  const changeColor = isUp
    ? "bg-green-100 text-green-700"
    : isDown
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-600";

  const changeIcon = isUp ? "▲" : isDown ? "▼" : "●";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-green-600 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-4xl">{product.image}</span>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${changeColor}`}>
          {changeIcon} {toBengaliNumber(Math.abs(product.change.pct))}%
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold">{product.nameBn}</h3>
      <p className="mt-1 text-sm text-gray-500">
        প্রতি {product.unit}
      </p>

      <p className="mt-4 text-2xl font-black text-[#17251c]">
        ৳{toBengaliNumber(product.today)}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        গতকাল: ৳{toBengaliNumber(product.yesterday)}
      </p>

      <p className="mt-4 font-bold text-green-700">
        বিস্তারিত দেখুন →
      </p>
    </Link>
  );
}

export default async function Home() {
  let products: Product[] = [];
  let hasError = false;

  try {
    const result = await getProducts();
    products = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : [];
  } catch {
    hasError = true;
  }

  const risingProducts = products
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallingProducts = products
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f7f8f2] text-[#17251c]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-4xl">🛒</span>
            <span>
              <span className="block text-2xl font-black">বাজার দর</span>
              <span className="text-sm text-gray-500">
                প্রতিদিনের বাজারের হিসাব
              </span>
            </span>
          </Link>

          <div className="flex gap-2">
            <Link
              href="/signin"
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100"
            >
              সাইন ইন
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#ccff00] px-4 py-2 text-sm font-bold hover:bg-[#b7e600]"
            >
              সাইন আপ
            </Link>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-4">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                index === 0
                  ? "bg-[#17251c] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.icon} {category.name}
            </Link>
          ))}
        </nav>
      </header>

      <div className="overflow-hidden bg-[#17251c] py-3 text-white">
        <div className="text-center text-sm">
          📈 বাজারদর দেখুন • 🥬 সবজির দাম • 🍚 চালের দাম • 🐟 মাছের দাম
        </div>
      </div>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-4 font-bold text-green-700">
            আপনার প্রতিদিনের বাজার সহকারী
          </p>
          <h1 className="text-4xl leading-tight font-black sm:text-5xl lg:text-6xl">
            বাজারের সঠিক
            <span className="block text-green-700">হিসাব রাখুন।</span>
          </h1>
          <p className="mt-5 max-w-lg leading-8 text-gray-600">
            চাল, ডাল, মাছ, মাংস ও নিত্যপ্রয়োজনীয় পণ্যের দাম এক নজরে দেখুন।
            বিভিন্ন বাজারের দামের তুলনা করুন সহজেই।
          </p>
          <a
            href="#সব-পণ্য"
            className="mt-8 inline-flex rounded-full bg-[#ccff00] px-7 py-4 font-bold transition hover:bg-[#b7e600]"
          >
            সব পণ্য দেখুন ↓
          </a>
        </div>

        <div className="flex min-h-72 items-center justify-center rounded-[2rem] bg-[#e8efdb] p-8 sm:min-h-96">
          <div className="text-center">
            <div className="text-8xl sm:text-9xl">🧺</div>
            <p className="mt-5 text-xl font-bold">
              প্রতিদিনের বাজার, এক জায়গায়
            </p>
            <div className="mt-5 flex justify-center gap-3 text-3xl">
              🍚 🫘 🥔 🧅 🐟
            </div>
          </div>
        </div>
      </section>

      {hasError ? (
        <p className="mx-auto max-w-6xl px-4 py-8 text-center text-red-700">
          দুঃখিত, পণ্যের তথ্য এখন লোড করা যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।
        </p>
      ) : (
        <>
          <section className="mx-auto max-w-6xl px-4 pb-12">
            <h2 className="mb-6 text-2xl font-black sm:text-3xl">
              ▲ আজ দাম বেড়েছে
            </h2>
            {risingProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {risingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">এখন কোনো পণ্যের দাম বাড়েনি।</p>
            )}
          </section>

          <section className="mx-auto max-w-6xl px-4 pb-12">
            <h2 className="mb-6 text-2xl font-black sm:text-3xl">
              ▼ আজ দাম কমেছে
            </h2>
            {fallingProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {fallingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">এখন কোনো পণ্যের দাম কমেনি।</p>
            )}
          </section>
        </>
      )}

      <section
        id="সব-পণ্য"
        className="mx-auto max-w-6xl scroll-mt-8 px-4 pb-20"
      >
        <div className="mb-8">
          <p className="font-bold text-green-700">আপনার বাজার তালিকা</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">সব পণ্য</h2>
          <p className="mt-3 text-gray-600">
            আপনার প্রয়োজনীয় পণ্য খুঁজে নিন।
          </p>
        </div>

        {hasError ? (
          <p className="text-red-700">পণ্য লোড করা যায়নি।</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <footer className="bg-[#17251c] text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-black">🛒 বাজার দর</p>
            <p className="mt-2 text-sm text-gray-300">
              প্রয়োজনীয় পণ্যের দাম এক নজরে।
            </p>
          </div>
          <p className="max-w-md text-sm leading-6 text-gray-300">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </footer>
    </main>
  );
}
