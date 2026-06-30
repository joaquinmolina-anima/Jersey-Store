import { useEffect, useMemo, useState } from "react";

import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";
import Loader from "../components/Loader";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const productCategories = products.map((product) => product.categoria);
    return ["Todas", ...new Set(productCategories)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.nombre.toLowerCase().includes(search.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "Todas" || product.categoria === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  if (loading) {
    return <Loader text="Cargando camisetas..." />;
  }

  if (errorMessage) {
    return <h2 className="page-message">{errorMessage}</h2>;
  }

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Catálogo oficial</span>

        <h1>Nuestras Camisetas</h1>

        <p>
          Explorá nuestra colección de camisetas de fútbol, seleccionadas para
          fanáticos que buscan identidad, diseño y calidad.
        </p>
      </section>

      <section className="catalog-tools">
        <input
          type="text"
          placeholder="Buscar camiseta..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </section>

      {filteredProducts.length === 0 ? (
        <section className="empty-box">
          <h2>No encontramos camisetas</h2>
          <p>Probá buscar con otro nombre o categoría.</p>
        </section>
      ) : (
        <section className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Products;
