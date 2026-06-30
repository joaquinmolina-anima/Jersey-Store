import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { createOrder } from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const { user, isLoggedIn } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    nombre: "",
    tarjeta: "",
    vencimiento: "",
    cvv: "",
    direccion: "",
  });

  const [processing, setProcessing] = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (cart.length === 0 && !paymentApproved) {
    return <Navigate to="/carrito" />;
  }

  function formatCardNumber(value) {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatExpiration(value) {
    const cleanValue = value.replace(/\D/g, "").slice(0, 4);

    if (cleanValue.length >= 3) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`;
    }

    return cleanValue;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "tarjeta") {
      setForm({
        ...form,
        tarjeta: formatCardNumber(value),
      });
      return;
    }

    if (name === "vencimiento") {
      setForm({
        ...form,
        vencimiento: formatExpiration(value),
      });
      return;
    }

    if (name === "cvv") {
      setForm({
        ...form,
        cvv: value.replace(/\D/g, "").slice(0, 4),
      });
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handlePayment(e) {
    e.preventDefault();

    const cleanCard = form.tarjeta.replace(/\s/g, "");

    if (cleanCard.length !== 16) {
      showToast("El número de tarjeta debe tener 16 dígitos", "warning");
      return;
    }

    if (form.vencimiento.length !== 5) {
      showToast("Ingresá una fecha válida en formato MM/AA", "warning");
      return;
    }

    if (form.cvv.length < 3) {
      showToast("El CVV debe tener al menos 3 dígitos", "warning");
      return;
    }

    try {
      setProcessing(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      await createOrder({
        usuario_id: user.id,
        carrito: cart,
        total: totalPrice,
      });

      clearCart();
      setPaymentApproved(true);

      showToast("Pago aprobado. Pedido realizado correctamente", "success");

      setTimeout(() => {
        navigate("/pedidos");
      }, 1500);
    } catch (error) {
      console.error(error);
      showToast("No se pudo procesar el pago", "error");
    } finally {
      setProcessing(false);
    }
  }

  if (paymentApproved) {
    return (
      <main className="page">
        <section className="payment-success">
          <div className="success-icon">✓</div>

          <h1>Pago aprobado</h1>

          <p>Tu pedido fue registrado correctamente en Jersey Store.</p>

          <Link to="/pedidos" className="btn">
            Ver mis pedidos
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Pago seguro</span>
        <h1>Finalizar compra</h1>
        <p>Completá los datos para simular el pago de tu pedido.</p>
      </section>

      <section className="checkout-layout">
        <form
          className="checkout-form checkout-premium"
          onSubmit={handlePayment}
        >
          <div className="checkout-secure">
            <span>🔒</span>
            <div>
              <h2>Pago protegido</h2>
              <p>Simulación segura para el proyecto Jersey Store.</p>
            </div>
          </div>

          <div className="card-preview">
            <div className="card-preview-top">
              <span>JERSEY CARD</span>
              <strong>💳</strong>
            </div>

            <p>{form.tarjeta || "0000 0000 0000 0000"}</p>

            <div className="card-preview-bottom">
              <span>{form.nombre || "NOMBRE DEL TITULAR"}</span>
              <span>{form.vencimiento || "MM/AA"}</span>
            </div>
          </div>

          <div className="payment-brands">
            <span>VISA</span>
            <span>Mastercard</span>
            <span>AMEX</span>
          </div>

          <input
            type="text"
            name="nombre"
            placeholder="Nombre del titular"
            value={form.nombre}
            onChange={handleChange}
            autoComplete="cc-name"
            required
          />

          <input
            type="text"
            name="tarjeta"
            placeholder="Número de tarjeta"
            value={form.tarjeta}
            onChange={handleChange}
            autoComplete="cc-number"
            inputMode="numeric"
            required
          />

          <div className="checkout-row">
            <input
              type="text"
              name="vencimiento"
              placeholder="MM/AA"
              value={form.vencimiento}
              onChange={handleChange}
              autoComplete="cc-exp"
              inputMode="numeric"
              required
            />

            <input
              type="password"
              name="cvv"
              placeholder="CVV"
              value={form.cvv}
              onChange={handleChange}
              autoComplete="cc-csc"
              inputMode="numeric"
              required
            />
          </div>

          <input
            type="text"
            name="direccion"
            placeholder="Dirección de entrega"
            value={form.direccion}
            onChange={handleChange}
            autoComplete="street-address"
            required
          />

          <button className="btn" type="submit" disabled={processing}>
            {processing ? "Procesando pago..." : "Pagar ahora"}
          </button>

          <Link to="/carrito" className="btn btn-outline">
            Volver al carrito
          </Link>
        </form>

        <aside className="checkout-summary">
          <h2>Resumen del pedido</h2>

          {cart.map((item) => (
            <div className="checkout-item" key={item.id}>
              <span>
                {item.nombre} x{item.quantity}
              </span>

              <strong>
                ${(Number(item.precio) * item.quantity).toFixed(2)}
              </strong>
            </div>
          ))}

          <div className="checkout-total">
            <span>Total</span>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>

          <p className="checkout-note">
            No se guarda información real de tarjetas.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default Checkout;
