import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import {
  createProduct,
  deleteProduct,
  getOrders,
  getProducts,
  updateOrderStatus,
  updateProduct,
} from "../services/api";

const emptyForm = {
  nombre: "",
  descripcion: "",
  precio: "",
  imagen: "",
  stock: "",
  categoria: "",
};

function Dashboard() {
  const { user, isLoggedIn, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);

  async function loadDashboard() {
    try {
      const [productsData, ordersData] = await Promise.all([
        getProducts(),
        getOrders(),
      ]);

      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error(error);
      showToast("No se pudo cargar el dashboard", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/cuenta" />;
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (editingId) {
        await updateProduct(editingId, form);
        showToast("Producto actualizado correctamente", "success");
      } else {
        await createProduct(form);
        showToast("Producto agregado correctamente a la tienda", "success");
      }

      setForm(emptyForm);
      setEditingId(null);
      loadDashboard();
    } catch (error) {
      console.error(error);
      showToast(error.message || "Error al guardar el producto", "error");
    }
  }

  function handleEdit(product) {
    setEditingId(product.id);

    setForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      imagen: product.imagen,
      stock: product.stock,
      categoria: product.categoria,
    });

    showToast(`Editando ${product.nombre}`, "info");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function confirmDeleteProduct() {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);

      showToast(`${productToDelete.nombre} eliminado correctamente`, "success");

      setProductToDelete(null);
      loadDashboard();
    } catch (error) {
      console.error(error);
      showToast("No se pudo eliminar el producto", "error");
    }
  }

  async function handleOrderStatus(id, estado) {
    try {
      await updateOrderStatus(id, estado);
      showToast(`Pedido #${id} actualizado a "${estado}"`, "success");
      loadDashboard();
    } catch (error) {
      console.error(error);
      showToast("No se pudo actualizar el pedido", "error");
    }
  }

  const totalStock = products.reduce((total, product) => {
    return total + Number(product.stock);
  }, 0);

  const totalSales = orders.reduce((total, order) => {
    return total + Number(order.total);
  }, 0);

  const pendingOrders = orders.filter((order) => {
    return order.estado === "pendiente";
  }).length;

  if (loading) {
    return <h2 className="page-message">Cargando dashboard...</h2>;
  }

  return (
    <>
      <main className="dashboard-page">
        <aside className="dashboard-sidebar">
          <div className="admin-box">
            <img src="/Imagenes Camisetas/logo256.ico" alt="Jersey Store" />

            <h2>JERSEY STORE</h2>

            <div className="admin-profile">
              <div className="admin-avatar">
                {user.nombre.charAt(0).toUpperCase()}
              </div>

              <div>
                <p>{user.nombre}</p>
                <span>👑 Administrador</span>
              </div>
            </div>
          </div>

          <nav>
            <a href="#stats">📊 Estadísticas</a>
            <a href="#productos">👕 Productos</a>
            <a href="#pedidos">📦 Pedidos</a>
          </nav>
        </aside>

        <section className="dashboard-content">
          <header className="dashboard-topbar">
            <div>
              <span className="eyebrow">Panel de administración</span>
              <h1>Dashboard</h1>
              <p>Gestioná productos, pedidos y estadísticas de Jersey Store.</p>
            </div>
          </header>

          <section className="dashboard-stats" id="stats">
            <article>
              <h3>Productos</h3>
              <p>{products.length}</p>
            </article>

            <article>
              <h3>Stock total</h3>
              <p>{totalStock}</p>
            </article>

            <article>
              <h3>Pedidos</h3>
              <p>{orders.length}</p>
            </article>

            <article>
              <h3>Pendientes</h3>
              <p>{pendingOrders}</p>
            </article>

            <article>
              <h3>Ventas</h3>
              <p>${totalSales.toFixed(2)}</p>
            </article>
          </section>

          <section className="dashboard-panel" id="productos">
            <h2>{editingId ? "Editar producto" : "Agregar producto"}</h2>

            <form className="dashboard-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre de la camiseta"
                value={form.nombre}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="precio"
                placeholder="Precio"
                value={form.precio}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />

              <input
                type="text"
                name="imagen"
                placeholder="Nombre de la imagen"
                value={form.imagen}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                required
              />

              <input
                type="text"
                name="categoria"
                placeholder="Categoría"
                value={form.categoria}
                onChange={handleChange}
                required
              />

              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={handleChange}
                required
              ></textarea>

              <button className="btn" type="submit">
                {editingId ? "Actualizar producto" : "Agregar producto"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                    showToast("Edición cancelada", "info");
                  }}
                >
                  Cancelar edición
                </button>
              )}
            </form>
          </section>

          <section className="dashboard-panel">
            <h2>Productos registrados</h2>

            <div className="admin-products-grid">
              {products.map((product) => (
                <article className="admin-product-card" key={product.id}>
                  <img
                    src={`/Imagenes Camisetas/${product.imagen}`}
                    alt={product.nombre}
                  />

                  <h3>{product.nombre}</h3>

                  <p>{product.descripcion}</p>

                  <span>${Number(product.precio).toFixed(2)}</span>

                  <small>
                    Stock: {product.stock} | Categoría: {product.categoria}
                  </small>

                  <div className="admin-actions">
                    <button className="btn" onClick={() => handleEdit(product)}>
                      Editar
                    </button>

                    <button
                      className="btn btn-outline"
                      onClick={() => setProductToDelete(product)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-panel" id="pedidos">
            <h2>Pedidos recientes</h2>

            <div className="orders-grid">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <h2>Pedido #{order.id}</h2>

                  <p>
                    Usuario:
                    <strong> {order.usuario || "Cliente"}</strong>
                  </p>

                  <p>
                    Total:
                    <strong> ${Number(order.total).toFixed(2)}</strong>
                  </p>

                  <p>
                    Estado:
                    <span className="order-status">{order.estado}</span>
                  </p>

                  <p>
                    Fecha:
                    <span>
                      {" "}
                      {new Date(order.fecha).toLocaleDateString("es-UY")}
                    </span>
                  </p>

                  <div className="admin-actions">
                    <button
                      className="btn"
                      onClick={() => handleOrderStatus(order.id, "preparando")}
                    >
                      Preparando
                    </button>

                    <button
                      className="btn"
                      onClick={() => handleOrderStatus(order.id, "enviado")}
                    >
                      Enviado
                    </button>

                    <button
                      className="btn"
                      onClick={() => handleOrderStatus(order.id, "entregado")}
                    >
                      Entregado
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>

      {productToDelete && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h2>Eliminar producto</h2>

            <p>
              ¿Seguro que querés eliminar{" "}
              <strong>{productToDelete.nombre}</strong>?
            </p>

            <div className="confirm-actions">
              <button
                className="btn btn-outline"
                onClick={() => setProductToDelete(null)}
              >
                Cancelar
              </button>

              <button className="btn" onClick={confirmDeleteProduct}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
