import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f7f9f5] px-6 text-center">
      <p className="text-7xl font-black text-[#17251c]">404</p>

      <h1 className="mt-4 text-3xl font-black text-[#17251c]">
        পৃষ্ঠা খুঁজে পাওয়া যায়নি
      </h1>

      <p className="mt-3 max-w-md text-gray-600">
        দুঃখিত! আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি পাওয়া যায়নি।
        সঠিক লিংক ব্যবহার করুন অথবা হোমপেজে ফিরে যান।
      </p>

      <Link
        href="/"
        className="mt-7 inline-flex rounded-full bg-[#ccff00] px-6 py-3 font-bold text-[#17251c] transition hover:bg-[#b7e600]"
      >
        ← হোমপেজে ফিরে যান
      </Link>
    </main>
  );
}