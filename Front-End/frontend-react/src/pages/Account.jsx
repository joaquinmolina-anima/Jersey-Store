import { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

function Account() {
  const { user, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { showToast } = useToast();

  const photoKey = `fotoPerfil-${user.id || user.email}`;

  const [profilePhoto, setProfilePhoto] = useState(() => {
    return localStorage.getItem(photoKey);
  });

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = 320;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedImage = canvas.toDataURL("image/jpeg", 0.75);

          resolve(compressedImage);
        };

        img.onerror = reject;
        img.src = reader.result;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handlePhotoChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const compressedPhoto = await compressImage(file);

      localStorage.setItem(photoKey, compressedPhoto);
      setProfilePhoto(compressedPhoto);

      showToast("Foto de perfil actualizada", "success");
    } catch (error) {
      console.error(error);
      showToast("No se pudo guardar la foto", "error");
    }
  }

  return (
    <main className="page account-premium-page">
      <section className="account-premium-card">
        <div className="account-cover"></div>

        <div className="account-profile-area">
          <div className="account-photo">
            {profilePhoto ? (
              <img src={profilePhoto} alt={user.nombre} />
            ) : (
              <span>{user.nombre.charAt(0).toUpperCase()}</span>
            )}
          </div>

          <label className="photo-upload">
            Cambiar foto
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>

          <h1>¡Hola, {user.nombre}!</h1>

          <p>{user.email}</p>

          <span className="account-role">
            {isAdmin ? "👑 Administrador" : "⭐ Cliente"}
          </span>
        </div>

        <div className="account-premium-stats">
          <article>
            <h3>Carrito</h3>
            <p>{totalItems}</p>
            <span>productos</span>
          </article>

          <article>
            <h3>Rol</h3>
            <p>{isAdmin ? "Admin" : "Cliente"}</p>
            <span>cuenta activa</span>
          </article>

          <article>
            <h3>Nivel</h3>
            <p>Fan</p>
            <span>Jersey Store</span>
          </article>
        </div>

        <section className="account-info-grid">
          <article>
            <h3>📦 Mis pedidos</h3>
            <p>Revisá el estado de tus compras realizadas.</p>
            <Link to="/pedidos" className="btn btn-outline">
              Ver pedidos
            </Link>
          </article>

          <article>
            <h3>👕 Catálogo</h3>
            <p>Seguí explorando camisetas de clubes y selecciones.</p>
            <Link to="/productos" className="btn">
              Ver camisetas
            </Link>
          </article>

          <article>
            <h3>🛒 Carrito</h3>
            <p>Continuá tu compra desde donde la dejaste.</p>
            <Link to="/carrito" className="btn btn-outline">
              Ir al carrito
            </Link>
          </article>

          {isAdmin && (
            <article>
              <h3>⚙ Dashboard</h3>
              <p>Administrá productos, pedidos y estadísticas.</p>
              <Link to="/dashboard" className="btn">
                Panel admin
              </Link>
            </article>
          )}
        </section>

        <section className="account-preferences">
          <h2>Tu experiencia en Jersey Store</h2>

          <div>
            <span>⚽ Fanático del fútbol</span>
            <span>🔥 Diseños favoritos</span>
            <span>📦 Seguimiento de pedidos</span>
            <span>🔒 Cuenta protegida</span>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Account;
