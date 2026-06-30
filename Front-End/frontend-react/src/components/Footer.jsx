import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src="/Imagenes Camisetas/logo256.ico" alt="Jersey Store" />

        <div>
          <h2>Jersey Store</h2>
          <p>Donde la pasión por el fútbol se viste con estilo.</p>
        </div>
      </div>

      <div className="footer-links">
        <h3>Navegación</h3>

        <Link to="/">Inicio</Link>
        <Link to="/productos">Camisetas</Link>
        <Link to="/carrito">Carrito</Link>
        <Link to="/cuenta">Mi cuenta</Link>
      </div>

      <div className="footer-links">
        <h3>Marca</h3>

        <a href="/#nosotros">Quiénes somos</a>
        <a href="/#beneficios">Beneficios</a>
        <Link to="/productos">Catálogo</Link>
      </div>

      <div className="footer-links">
        <h3>Contacto</h3>

        <p>📍 Montevideo, Uruguay</p>
        <p>📞 11223344</p>
        <p>✉️ contacto@jerseystore.com</p>
      </div>

      <div className="footer-bottom">
        <p>Jersey Store © 2026 - Proyecto web de camisetas de fútbol.</p>
      </div>
    </footer>
  );
}

export default Footer;
