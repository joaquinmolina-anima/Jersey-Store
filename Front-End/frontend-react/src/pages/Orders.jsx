import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { getUserOrders } from "../services/api";

function Orders() {
  const { user, isLoggedIn } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <h2 className="page-message">Cargando pedidos...</h2>;
  }

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Historial</span>
        <h1>Mis Pedidos</h1>
        <p>Consultá el estado de tus compras realizadas en Jersey Store.</p>
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
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
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
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Orders;
