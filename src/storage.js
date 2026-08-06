const CONTENT_KEY = "paopao_content_v1";
const PRODUCTS_KEY = "paopao_products_v1";

export function loadContent(fallback) {
  try {
    const raw = localStorage.getItem(CONTENT_KEY);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

export function saveContent(content) {
  try {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  } catch (e) {
    console.error("Could not save store content:", e);
  }
}

export function loadProducts(fallback) {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error("Could not save products (images can be large — try smaller photos):", e);
  }
}

export function resetAllData() {
  localStorage.removeItem(CONTENT_KEY);
  localStorage.removeItem(PRODUCTS_KEY);
}
