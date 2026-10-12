

import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/api";

export const instant = false;

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};


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
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: Market[];
};

function bn(value: number) {
  return value.toLocaleString("bn-BD");
}

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Product | null = null;

  try {
    const allProducts = await getProducts();
    const products: Product[] = Array.isArray(allProducts)
      ? allProducts
      : Array.isArray(allProducts?.data)
        ? allProducts.data
        : [];

    product = products.find((item) => item.slug === slug) ?? null;

    if (!product) {
      const result = await getProductById(slug);
      product = result?.data ?? result;
    }
  } catch {
    notFound();
  }

  if (!product || product.slug !== slug) {
    notFound();
  }

  const marketPrices = product.markets ?? [];
  const minimum = marketPrices.length
    ? Math.min(...marketPrices.map((market) => market.min))
    : product.today;
  const maximum = marketPrices.length
    ? Math.max(...marketPrices.map((market) => market.max))
    : product.today;
  const average =
    marketPrices.length > 0
      ? Math.round(
          marketPrices.reduce(
            (total, market) => total + (market.min + market.max) / 2,
            0,
          ) / marketPrices.length,
        )
      : product.today;

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  return (
    <main className="min-h-screen bg-[#f7f8f2] text-[#17251c]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
          <Link href="/" className="text-2xl font-black">
            🛒 বাজার দর
          </Link>
          <Link
            href="/"
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-100"
          >
            ← হোমে ফিরুন
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <p className="font-semibold text-green-700">
          {product.categoryIcon} {product.categoryNameBn}
        </p>

        <section className="mt-4 rounded-3xl border border-gray-200 bg-white p-6 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-[#e8efdb] text-6xl">
              {product.image}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-black sm:text-4xl">
                {product.nameBn}
              </h1>
              <p className="mt-2 text-gray-500">
                প্রতি {product.unit}
              </p>

              <p className="mt-5 text-4xl font-black">
                ৳{bn(product.today)}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                  isUp
                    ? "bg-green-100 text-green-700"
                    : isDown
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {isUp ? "▲ দাম বেড়েছে" : isDown ? "▼ দাম কমেছে" : "● দাম অপরিবর্তিত"}
                {" "}
                {bn(Math.abs(product.change.pct))}%
              </span>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-black">দামের সারসংক্ষেপ</h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">সর্বনিম্ন দাম</p>
              <p className="mt-2 text-2xl font-black text-green-700">
                ৳{bn(minimum)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">সর্বোচ্চ দাম</p>
              <p className="mt-2 text-2xl font-black text-red-700">
                ৳{bn(maximum)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">গড় বাজারদর</p>
              <p className="mt-2 text-2xl font-black">
                ৳{bn(average)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-black">বাজারভিত্তিক দাম</h2>
          <p className="mt-2 text-gray-600">
            বিভিন্ন বাজারে এই পণ্যের সম্ভাব্য দাম।
          </p>

          {marketPrices.length > 0 ? (
            <div className="mt-5 space-y-3">
              {marketPrices.map((market, index) => (
                <div
                  key={`${market.market}-${market.division}-${index}`}
                  className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-bold">{market.market}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {market.division}
                    </p>
                  </div>

                  <p className="font-bold">
                    ৳{bn(market.min)} – ৳{bn(market.max)}
                    <span className="ml-1 text-sm font-normal text-gray-500">
                      / {product.unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-white p-5 text-gray-600">
              এই পণ্যের বাজারভিত্তিক দাম পাওয়া যায়নি।
            </p>
          )}
        </section>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex rounded-full bg-[#ccff00] px-6 py-3 font-bold hover:bg-[#b7e600]"
          >
            ← সব পণ্যে ফিরে যান
          </Link>
        </div>
      </div>

      <footer className="bg-[#17251c] px-4 py-8 text-center text-sm leading-6 text-gray-300">
        <p className="font-bold text-white">🛒 বাজার দর</p>
        <p className="mt-2">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </footer>
    </main>
  );
}
