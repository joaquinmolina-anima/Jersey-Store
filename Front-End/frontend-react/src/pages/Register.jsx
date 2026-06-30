import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      await registerUser({
        nombre: form.nombre,
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-info">
          <span className="eyebrow">Jersey Store</span>

          <h1>Creá tu cuenta</h1>

          <p>
            Registrate para comprar camisetas, guardar tus pedidos y seguir el
            estado de tus compras.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Registro</h2>

          {message && <p className="form-message">{message}</p>}

          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            autoComplete="name"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            minLength="6"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            minLength="6"
            required
          />

          <button className="btn" type="submit">
            Crear cuenta
          </button>

          <p>
            ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Register;
