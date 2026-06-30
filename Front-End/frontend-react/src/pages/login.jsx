import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loginUser } from "../services/api";

function Login() {
  const navigate = useNavigate();

  const { login, isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    return <Navigate to="/cuenta" replace />;
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function fillDemoUser(type) {
    if (type === "admin") {
      setForm({
        email: "Kevin2345@gmail.com",
        password: "123456",
      });
    }

    if (type === "cliente") {
      setForm({
        email: "cliente@gmail.com",
        password: "123456",
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const data = await loginUser(form);

      login(data.usuario, data.token);

      if (data.usuario.rol === "admin") {
        showToast(
          `Bienvenido administrador, ${data.usuario.nombre}`,
          "success",
        );

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 900);

        return;
      }

      showToast(`Bienvenido, ${data.usuario.nombre}`, "success");

      setTimeout(() => {
        navigate("/cuenta", { replace: true });
      }, 900);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Correo o contraseña incorrectos");
      showToast("No se pudo iniciar sesión", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-premium-page">
      <section className="login-premium-card">
        <div className="login-brand-panel">
          <img src="/Imagenes Camisetas/logo256.ico" alt="Jersey Store" />

          <span className="eyebrow">Acceso seguro</span>

          <h1>Jersey Store</h1>

          <p>
            Iniciá sesión para comprar camisetas, revisar tus pedidos o acceder
            al panel de administración.
          </p>

          <div className="login-benefits">
            <article>
              <span>🔒</span>
              <p>Sesión protegida</p>
            </article>

            <article>
              <span>🛒</span>
              <p>Carrito sincronizado</p>
            </article>

            <article>
              <span>📦</span>
              <p>Seguimiento de pedidos</p>
            </article>
          </div>
        </div>

        <form className="login-form-panel" onSubmit={handleSubmit}>
          <div className="login-form-header">
            <span className="eyebrow">Bienvenido</span>

            <h2>Iniciar sesión</h2>

            <p>Entrá con tu cuenta para continuar en Jersey Store.</p>
          </div>

          {message && <p className="form-message">{message}</p>}

          <label>
            Correo electrónico
            <input
              type="email"
              name="email"
              placeholder="ejemplo@email.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Contraseña
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Ingresá tu contraseña"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </label>

          <button className="btn login-submit" type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Entrar"}
          </button>

          <div className="demo-access">
            <p>Accesos rápidos para probar:</p>

            <div>
              <button type="button" onClick={() => fillDemoUser("admin")}>
                👑 Admin
              </button>

              <button type="button" onClick={() => fillDemoUser("cliente")}>
                👤 Cliente
              </button>
            </div>
          </div>

          <p className="auth-switch">
            ¿No tenés cuenta? <Link to="/registro">Crear cuenta</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default Login;
