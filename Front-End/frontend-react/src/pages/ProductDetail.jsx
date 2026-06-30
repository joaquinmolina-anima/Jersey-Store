import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { getProductById } from "../services/api";
import Loader from "../components/Loader";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductById(id);

        if (!data) {
          setErrorMessage("Producto no encontrado.");
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return <Loader text="Cargando producto..." />;
  }

  if (errorMessage) {
    return <h2 className="page-message">{errorMessage}</h2>;
  }

  return (
    <main className="page">
      <section className="detail-card">
        <div className="detail-image">
          <img
            src={`/Imagenes Camisetas/${product.imagen}`}
            alt={product.nombre}
          />
        </div>

        <div className="detail-info">
          <span className="eyebrow">{product.categoria}</span>

          <h1>{product.nombre}</h1>

          <p>{product.descripcion}</p>

          <h2>${Number(product.precio).toFixed(2)}</h2>

          <p className="stock">Stock disponible: {product.stock}</p>

          <div className="hero-actions">
            <button
              className="btn"
              onClick={() => {
                addToCart(product);
                showToast(`${product.nombre} agregada al carrito`, "success");
              }}
            >
              Agregar al carrito
            </button>

            <Link to="/productos" className="btn btn-outline">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;
