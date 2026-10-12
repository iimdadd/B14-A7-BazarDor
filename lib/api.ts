
const API_BASE_URL =
  "https://api.api-store.workers.dev/api/bazardor";

export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি");
  }

  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("ক্যাটাগরির তথ্য লোড করা যায়নি");
  }

  return response.json();
}

export async function getProductById(id: string) {
  const response = await fetch(
    `${API_BASE_URL}/products/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("পণ্যটি পাওয়া যায়নি");
  }

  return response.json();
}

export async function getProductsByCategory(category: string) {
  const response = await fetch(
    `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("এই ক্যাটাগরির পণ্য লোড করা যায়নি");
  }

  return response.json();
}
