const CART_STORAGE_KEY = "velora_cart";

export function loadCartFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load cart from storage:", err);
    return [];
  }
}

export function saveCartToStorage(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save cart to storage:", err);
  }
}