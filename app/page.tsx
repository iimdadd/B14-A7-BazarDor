
import Link from "next/link";
import { getProducts } from "@/lib/api";
import ProductSearch from "@/components/ProductSearch";

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
    ? "bg-red-50 text-red-700 ring-red-100"
    : isDown
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : "bg-gray-100 text-gray-600 ring-gray-200";

  const changeIcon = isUp ? "↑" : isDown ? "↓" : "→";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col rounded-3xl border border-[#e8ecdf] bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-xl sm:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-[#f2f6e9] text-4xl transition-transform duration-300 group-hover:scale-110 sm:size-20 sm:text-5xl">
          {product.image}
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ring-1 sm:px-3 ${changeColor}`}
        >
          {changeIcon} {toBengaliNumber(Math.abs(product.change.pct))}%
        </span>
      </div>

      <div className="mt-5 flex-1">
        <h3 className="text-base font-extrabold text-[#17251c] sm:text-lg">
          {product.nameBn}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          প্রতি {product.unit}
        </p>
      </div>

      <div className="mt-5 border-t border-dashed border-gray-200 pt-4">
        <p className="text-xs font-medium text-gray-500">আজকের দাম</p>
        <p className="mt-1 text-xl font-black tracking-tight text-[#17251c] sm:text-2xl">
          ৳{toBengaliNumber(product.today)}
        </p>
        <p className="mt-2 text-xs text-gray-500 sm:text-sm">
          গতকাল: ৳{toBengaliNumber(product.yesterday)}
        </p>
      </div>

      <p className="mt-4 font-bold text-green-700 transition-colors group-hover:text-green-900">
        বিস্তারিত দেখুন <span aria-hidden="true">→</span>
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
    <main className="min-h-screen overflow-hidden bg-[#f8faf5] text-[#17251c]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#17251c] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-[#ccff00]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-24 size-96 rounded-full bg-green-500/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-[#d9f99d]">
              <span className="size-2 rounded-full bg-[#ccff00]" />
              আপনার প্রতিদিনের বাজার সহকারী
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl leading-[1.2] font-black tracking-tight sm:text-5xl lg:text-6xl">
              বাজারের দাম জানুন,
              <span className="mt-2 block text-[#ccff00]">
                পরিকল্পনা করুন
                <br className="hidden sm:block" /> নিশ্চিন্তে।
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-300 sm:text-lg">
              চাল, ডাল, মাছ, মাংস ও নিত্যপ্রয়োজনীয় পণ্যের দাম এক জায়গায়
              দেখুন। বাজারের হিসাব রাখুন সহজে।
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#সব-পণ্য"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ccff00] px-6 py-3.5 font-extrabold text-[#17251c] transition hover:bg-[#b7e600] sm:px-7"
              >
                পণ্যের দাম দেখুন <span aria-hidden="true">↓</span>
              </a>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
              >
                শুরু করুন
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-300">
              <span>✓ সহজে দাম দেখুন</span>
              <span>✓ পরিবর্তন তুলনা করুন</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-[#ccff00]/10 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-300">স্বাগতম</p>
                  <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                    আজকের বাজার 🧺
                  </h2>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#ccff00] text-2xl">
                  🛒
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: "🍚", name: "চাল ও ডাল", note: "নিত্যপ্রয়োজনীয়" },
                  { icon: "🥬", name: "তাজা সবজি", note: "দৈনন্দিন বাজার" },
                  { icon: "🐟", name: "মাছ ও মাংস", note: "প্রোটিনের উৎস" },
                  { icon: "🥛", name: "ডিম ও দুধ", note: "পরিবারের খাবার" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10"
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <p className="mt-3 font-bold">{item.name}</p>
                    <p className="mt-1 text-xs text-gray-400">{item.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#ccff00] p-4 text-[#17251c]">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-extrabold">বাজারের হিসাব এক নজরে</p>
                  <p className="mt-1 text-xs">
                    পণ্যের দাম ও পরিবর্তন সহজে দেখুন
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold tracking-wide text-green-700">
              আপনার পছন্দের বিভাগ
            </p>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">
              কী কিনবেন আজ?
            </h2>
          </div>
          <p className="text-sm text-gray-500">বিভাগ বেছে নিন</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center rounded-2xl border border-[#e8ecdf] bg-white px-3 py-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-[#f2f6e9] text-3xl transition group-hover:scale-110">
                {category.icon}
              </span>
              <span className="mt-3 text-sm font-extrabold">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Price changes */}
      {hasError ? (
        <p className="mx-auto max-w-7xl px-4 py-12 text-center text-red-700 sm:px-6 lg:px-8">
          দুঃখিত, পণ্যের তথ্য এখন লোড করা যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।
        </p>
      ) : (
        <>
          <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-red-600">
                  আজকের মূল্য পরিবর্তন
                </p>
                <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                  <span className="text-red-600">↑</span> আজ দাম বেড়েছে
                </h2>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-600 ring-1 ring-gray-200">
                {toBengaliNumber(risingProducts.length)}টি পণ্য
              </span>
            </div>

            {risingProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {risingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
                এখন কোনো পণ্যের দাম বাড়েনি।
              </div>
            )}
          </section>

          <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-emerald-700">
                  সাশ্রয়ের খোঁজ
                </p>
                <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                  <span className="text-emerald-600">↓</span> আজ দাম কমেছে
                </h2>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-600 ring-1 ring-gray-200">
                {toBengaliNumber(fallingProducts.length)}টি পণ্য
              </span>
            </div>

            {fallingProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {fallingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
                এখন কোনো পণ্যের দাম কমেনি।
              </div>
            )}
          </section>
        </>
      )}

      {/* All products and search */}
      <section
        id="সব-পণ্য"
        className="mx-auto max-w-7xl scroll-mt-8 px-4 pb-20 pt-16 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-green-700">
              আপনার বাজার তালিকা
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              সব পণ্য
            </h2>
            <p className="mt-3 text-gray-600">
              আপনার প্রয়োজনীয় পণ্যের দাম খুঁজে নিন।
            </p>
          </div>

          <div className="rounded-2xl bg-[#eaf1df] px-5 py-3">
            <p className="text-sm font-semibold text-[#43553b]">
              মোট পণ্য
            </p>
            <p className="mt-1 text-2xl font-black text-[#17251c]">
              {toBengaliNumber(products.length)}
            </p>
          </div>
        </div>

        {hasError ? (
          <p className="rounded-2xl border border-red-100 bg-red-50 p-5 text-red-700">
            পণ্য লোড করা যায়নি। কিছুক্ষণ পরে আবার চেষ্টা করুন।
          </p>
        ) : (
          <ProductSearch products={products} />
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#17251c] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 sm:items-start">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#ccff00] text-2xl">
                  🛒
                </span>
                <span>
                  <span className="block text-2xl font-black">বাজার দর</span>
                  <span className="mt-1 block text-sm text-gray-400">
                    প্রতিদিনের বাজারের হিসাব
                  </span>
                </span>
              </Link>
              <p className="mt-4 max-w-md text-sm leading-7 text-gray-300">
                নিত্যপ্রয়োজনীয় পণ্যের দাম এক জায়গায় দেখে আপনার বাজারের
                পরিকল্পনা সহজ করুন।
              </p>
            </div>

            <div className="sm:text-right">
              <p className="font-bold">দরকারি লিংক</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-300 sm:justify-end">
                <Link href="/" className="transition hover:text-[#ccff00]">
                  হোম
                </Link>
                <a
                  href="#সব-পণ্য"
                  className="transition hover:text-[#ccff00]"
                >
                  সব পণ্য
                </a>
                <Link
                  href="/signin"
                  className="transition hover:text-[#ccff00]"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  className="transition hover:text-[#ccff00]"
                >
                  সাইন আপ
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5 text-sm leading-6 text-gray-400">
            <p>
              সকল দাম সম্ভাব্য; বাজার ও সময় অনুযায়ী দাম পরিবর্তিত হতে পারে।
            </p>
            <p className="mt-2">
              © {new Date().getFullYear()} বাজার দর। সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
