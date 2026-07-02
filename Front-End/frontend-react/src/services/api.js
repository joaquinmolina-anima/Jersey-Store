const API_URL = "http://localhost:3000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensaje || "Error en la petición");
  }

  return data;
}

export function getProducts() {
  return request("/productos");
}

export async function getProductById(id) {
  const products = await getProducts();
  return products.find((product) => Number(product.id) === Number(id));
}

export function createProduct(productData) {
  return request("/productos", {
    method: "POST",
    body: JSON.stringify(productData),
  });
}

export function updateProduct(id, productData) {
  return request(`/productos/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
}

export function deleteProduct(id) {
  return request(`/productos/${id}`, {
    method: "DELETE",
  });
}

export function loginUser(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function registerUser(userData) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function getOrders() {
  return request("/pedidos");
}

export function getUserOrders(userId) {
  return request(`/pedidos/usuario/${userId}`);
}

export function createOrder(orderData) {
  return request("/pedidos", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export function updateOrderStatus(id, estado) {
  return request(`/pedidos/${id}`, {
    method: "PUT",
    body: JSON.stringify({ estado }),
  });
}

export function getOrderDetails(orderId) {
  return request(`/pedidos/${orderId}/detalles`);
}
