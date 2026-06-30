import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { showToast } = useToast();

  const navigate = useNavigate();

  function closeMenu() {
    setMenuOpen(false);
  }

  function openLogoutModal() {
    closeMenu();
    setShowLogoutModal(true);
  }

  function cancelLogout() {
    setShowLogoutModal(false);
  }

  function confirmLogout() {
    setShowLogoutModal(false);

    showToast("Cerrando sesión...", "info");

    setTimeout(() => {
      logout();
      navigate("/login", { replace: true });
      showToast("Sesión cerrada correctamente", "success");
    }, 700);
  }

  return (
    <>
      <header className="navbar">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/Imagenes Camisetas/logo256.ico" alt="Jersey Store" />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <NavLink to="/" onClick={closeMenu}>
            🏠 Inicio
          </NavLink>

          <NavLink to="/productos" onClick={closeMenu}>
            👕 Camisetas
          </NavLink>

          {isLoggedIn && (
            <NavLink to="/pedidos" onClick={closeMenu}>
              📦 Mis Pedidos
            </NavLink>
          )}

          <NavLink to="/carrito" className="cart-link" onClick={closeMenu}>
            🛒 Carrito
            <span className="cart-count">{totalItems}</span>
          </NavLink>

          {isAdmin && (
            <NavLink to="/dashboard" onClick={closeMenu}>
              ⚙ Dashboard
            </NavLink>
          )}

          {isLoggedIn ? (
            <>
              <NavLink to="/cuenta" className="user-link" onClick={closeMenu}>
                {isAdmin ? "👑" : "👤"} {user.nombre}
              </NavLink>

              <button className="nav-button" onClick={openLogoutModal}>
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                🔑 Login
              </NavLink>

              <NavLink
                to="/registro"
                className="btn-register"
                onClick={closeMenu}
              >
                Crear cuenta
              </NavLink>
            </>
          )}
        </nav>
      </header>

      {showLogoutModal && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <h2>¿Cerrar sesión?</h2>

            <p>Vas a salir de tu cuenta de Jersey Store.</p>

            <div className="logout-actions">
              <button className="btn btn-outline" onClick={cancelLogout}>
                Cancelar
              </button>

              <button className="btn" onClick={confirmLogout}>
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
