import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

function Cart() {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const {
    cart,
    totalPrice,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  if (!isLoggedIn && cart.length > 0) {
    return <Navigate to="/login" />;
  }

  if (cart.length === 0) {
    return (
      <main className="page">
        <section className="page-header">
          <span className="eyebrow">Tu compra</span>
          <h1>Carrito vacío</h1>
          <p>Todavía no agregaste productos al carrito.</p>

          <Link to="/productos" className="btn">
            Ver camisetas
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Tu compra</span>
        <h1>Carrito</h1>
        <p>Revisá tus productos antes de finalizar la compra.</p>
      </section>

      <section className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <article className="cart-item" key={item.id}>
              <img
                src={`/Imagenes Camisetas/${item.imagen}`}
                alt={item.nombre}
              />

              <div className="cart-item-info">
                <h2>{item.nombre}</h2>

                <p>{item.descripcion}</p>

                <strong>${Number(item.precio).toFixed(2)}</strong>

                <div className="quantity-actions">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
              </div>

              <button
                className="btn btn-outline"
                onClick={() => {
                  removeFromCart(item.id);
                  showToast(`${item.nombre} eliminado del carrito`, "info");
                }}
              >
                Eliminar
              </button>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Resumen</h2>

          <p>Total a pagar</p>

          <strong>${totalPrice.toFixed(2)}</strong>

          <Link to="/checkout" className="btn">
            Finalizar compra
          </Link>

          <button
            className="btn btn-outline"
            onClick={() => {
              clearCart();
              showToast("Carrito vaciado correctamente", "info");
            }}
          >
            Vaciar carrito
          </button>
        </aside>
      </section>
    </main>
  );
}

export default Cart;
