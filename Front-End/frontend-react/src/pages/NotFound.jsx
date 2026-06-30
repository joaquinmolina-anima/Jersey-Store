import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="page">
      <section className="empty-box">
        <span className="eyebrow">Error 404</span>

        <h1>Página no encontrada</h1>

        <p>
          La página que estás buscando no existe o fue movida dentro de Jersey
          Store.
        </p>

        <Link to="/" className="btn">
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}

export default NotFound;
