import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const stock = Number(product.stock);
  const price = Number(product.precio).toFixed(2);

  function handleAddToCart() {
    addToCart(product);
    showToast(`${product.nombre} agregada al carrito`, "success");
  }

  return (
    <article className="product-card premium-product-card">
      <div className="product-badge">Nuevo</div>

      <div className="product-image">
        <img
          src={`/Imagenes Camisetas/${product.imagen}`}
          alt={product.nombre}
        />
      </div>

      <div className="product-info">
        <span className="category">{product.categoria}</span>

        <h2>{product.nombre}</h2>

        <p>{product.descripcion}</p>

        <div className="product-rating">
          ⭐⭐⭐⭐⭐ <small>4.9</small>
        </div>

        <div className="product-stock">
          {stock > 0 ? `Stock disponible: ${stock}` : "Sin stock"}
        </div>

        <div className="product-bottom">
          <strong>${price}</strong>
        </div>

        <div className="product-actions">
          <Link to={`/productos/${product.id}`} className="btn btn-outline">
            Ver detalle
          </Link>

          <button
            className="btn"
            onClick={handleAddToCart}
            disabled={stock <= 0}
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
