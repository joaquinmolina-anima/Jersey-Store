import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getOrderDetails, getUserOrders } from "../services/api";

function Orders() {
  const { user, isLoggedIn } = useAuth();

  const [orders, setOrders] = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadOrders() {
      if (!user) return;

      try {
        const data = await getUserOrders(user.id);
        setOrders(data);
      } catch (error) {
        console.error(error);
        setMessage("No se pudieron cargar tus pedidos.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  async function toggleOrder(orderId) {
    if (openOrderId === orderId) {
      setOpenOrderId(null);
      return;
    }

    setOpenOrderId(orderId);

    if (orderDetails[orderId]) return;

    try {
      setLoadingDetails(true);

      const details = await getOrderDetails(orderId);

      setOrderDetails({
        ...orderDetails,
        [orderId]: details,
      });
    } catch (error) {
      console.error(error);
      setMessage("No se pudieron cargar los productos del pedido.");
    } finally {
      setLoadingDetails(false);
    }
  }

  if (loading) {
    return <h2 className="page-message">Cargando pedidos...</h2>;
  }

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Historial</span>
        <h1>Mis Pedidos</h1>
        <p>Consultá el estado y los productos de tus compras.</p>
      </section>

      {message && <h2 className="page-message">{message}</h2>}

      {orders.length === 0 ? (
        <section className="empty-box">
          <h2>Todavía no tenés pedidos</h2>
          <p>Cuando finalices una compra, aparecerá acá.</p>

          <Link to="/productos" className="btn">
            Ver camisetas
          </Link>
        </section>
      ) : (
        <section className="orders-grid">
          {orders.map((order) => {
            const isOpen = openOrderId === order.id;
            const productos = orderDetails[order.id] || [];

            return (
              <article
                className={`order-card order-card-clickable ${
                  isOpen ? "order-open" : ""
                }`}
                key={order.id}
                onClick={() => toggleOrder(order.id)}
              >
                <h2>Pedido #{order.id}</h2>

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

                <button
                  className="btn btn-outline order-toggle"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOrder(order.id);
                  }}
                >
                  {isOpen ? "Ocultar productos" : "Ver productos"}
                </button>

                {isOpen && (
                  <div
                    className="order-products"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3>Productos comprados</h3>

                    {loadingDetails ? (
                      <p className="order-no-products">Cargando productos...</p>
                    ) : productos.length > 0 ? (
                      productos.map((producto, index) => (
                        <div className="order-product-item" key={index}>
                          <img
                            src={`/Imagenes Camisetas/${producto.imagen}`}
                            alt={producto.nombre}
                            className="order-product-image"
                          />

                          <div className="order-product-info">
                            <strong>{producto.nombre}</strong>

                            <span>
                              Cantidad:{" "}
                              {producto.cantidad || producto.quantity || 1}
                            </span>

                            <small>
                              Precio unitario: $
                              {Number(
                                producto.precio ||
                                  producto.precio_unitario ||
                                  0,
                              ).toFixed(2)}
                            </small>
                          </div>

                          <h3 className="order-product-price">
                            $
                            {(
                              (producto.cantidad || 1) *
                              Number(
                                producto.precio || producto.precio_unitario,
                              )
                            ).toFixed(2)}
                          </h3>
                        </div>
                      ))
                    ) : (
                      <p className="order-no-products">
                        No se encontraron productos para este pedido.
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default Orders;
