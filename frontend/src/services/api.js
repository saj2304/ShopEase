import axios from "axios"
const API = axios.create({ baseURL: "/api" })
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
API.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) { localStorage.clear(); window.location.href = "/login" }
  return Promise.reject(err)
})
export const authAPI     = { register: (d) => API.post("/auth/register", d), login: (d) => API.post("/auth/login", d) }
export const productAPI  = { getAll: (p=0,s=12) => API.get(`/products?page=${p}&size=${s}`), getById: (id) => API.get(`/products/${id}`), getByCategory: (cid,p=0) => API.get(`/products/category/${cid}?page=${p}`), search: (kw,p=0) => API.get(`/products/search?keyword=${kw}&page=${p}`) }
export const categoryAPI = { getAll: () => API.get("/categories"), getById: (id) => API.get(`/categories/${id}`) }
export const cartAPI     = { get: () => API.get("/cart"), add: (pid,qty=1) => API.post(`/cart/add?productId=${pid}&quantity=${qty}`), update: (pid,qty) => API.put(`/cart/update?productId=${pid}&quantity=${qty}`), remove: (pid) => API.delete(`/cart/remove/${pid}`), clear: () => API.delete("/cart/clear") }
export const orderAPI    = { place: (d) => API.post("/orders", d), verifyPayment: (d) => API.post("/orders/verify-payment", d), myOrders: (p=0) => API.get(`/orders/my-orders?page=${p}`), getById: (id) => API.get(`/orders/${id}`) }
export const adminAPI    = { dashboard: () => API.get("/admin/dashboard"), createProduct: (d) => API.post("/admin/products", d), updateProduct: (id,d) => API.put(`/admin/products/${id}`, d), deleteProduct: (id) => API.delete(`/admin/products/${id}`), createCategory: (d) => API.post("/admin/categories", d), updateCategory: (id,d) => API.put(`/admin/categories/${id}`, d), deleteCategory: (id) => API.delete(`/admin/categories/${id}`), getAllOrders: (p=0) => API.get(`/admin/orders?page=${p}`), updateStatus: (id,s) => API.patch(`/admin/orders/${id}/status?status=${s}`) }
export default API
