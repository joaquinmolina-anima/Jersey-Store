import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";

const carouselImages = [
  {
    title: "Nueva Colección 2026",
    image: "/Imagenes Camisetas/Tony Alemania.png",
    text: "Camisetas modernas para vivir cada partido con identidad y estilo.",
    tag: "Temporada 2026",
  },
  {
    title: "Selecciones del mundo",
    image: "/Imagenes Camisetas/Diomande Costa de Marfil.png",
    text: "Representá los colores de tu país con camisetas únicas y premium.",
    tag: "Selecciones",
  },
  {
    title: "Los grandes de Asia",
    image: "/Imagenes Camisetas/Ito Japon.png",
    text: "Clubes históricos, diseños exclusivos y pasión internacional.",
    tag: "Clubes",
  },
  {
    title: "Ofertas destacadas",
    image: "/Imagenes Camisetas/Forlan Uruguay.png",
    text: "Encontrá camisetas especiales para sumar a tu colección futbolera.",
    tag: "Promos",
  },
];

const featuredTeams = [
  "Real Madrid",
  "Barcelona",
  "Uruguay",
  "Argentina",
  "Brasil",
  "Portugal",
];

const testimonials = [
  {
    name: "Mateo",
    text: "La página es fácil de usar y las camisetas se ven increíbles.",
  },
  {
    name: "Lucía",
    text: "Me gustó mucho poder ver el detalle antes de comprar.",
  },
  {
    name: "Joaquín",
    text: "El diseño tiene mucha identidad futbolera.",
  },
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === carouselImages.length - 1 ? 0 : prev + 1,
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const products = await getProducts();
        setFeaturedProducts(products.slice(0, 6));
      } catch (error) {
        console.error("Error al cargar productos destacados", error);
      }
    }

    loadFeaturedProducts();
  }, []);

  const slide = carouselImages[currentSlide];

  return (
    <main>
      <section className="hero hero-premium">
        <div className="hero-text">
          <span className="eyebrow">Nueva colección 2026</span>

          <h1>La tienda para quienes viven el fútbol con pasión</h1>

          <p>
            En Jersey Store encontrás camisetas con identidad, diseño moderno y
            una experiencia pensada para fanáticos que llevan los colores en la
            piel.
          </p>

          <div className="hero-actions">
            <Link to="/productos" className="btn">
              Comprar ahora
            </Link>

            <a href="#nosotros" className="btn btn-outline">
              Conocer la marca
            </a>
          </div>
        </div>

        <div className="hero-image hero-showcase">
          <img src="/Imagenes Camisetas/CR7 Jersey.png" alt="Jersey Store" />
        </div>
      </section>

      <section className="stats-section">
        <article>
          <h2>+100</h2>
          <p>Camisetas disponibles</p>
        </article>

        <article>
          <h2>+500</h2>
          <p>Fanáticos alcanzados</p>
        </article>

        <article>
          <h2>24/7</h2>
          <p>Tienda online activa</p>
        </article>

        <article>
          <h2>100%</h2>
          <p>Pasión futbolera</p>
        </article>
      </section>

      <section className="home-carousel">
        <div className="carousel-text">
          <span className="eyebrow">Camisetas destacadas</span>
          <h2>{slide.title}</h2>
          <p>{slide.text}</p>

          <Link to="/productos" className="btn">
            Ver catálogo
          </Link>
        </div>

        <div className="carousel-image">
          <img src={slide.image} alt={slide.title} />
        </div>

        <div className="carousel-dots">
          {carouselImages.map((item, index) => (
            <button
              key={item.title}
              className={index === currentSlide ? "dot active" : "dot"}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ver ${item.title}`}
            ></button>
          ))}
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="home-featured-products">
          <div className="section-heading">
            <span className="eyebrow">Más productos</span>
            <h2>Productos destacados</h2>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </section>
      )}

      <section className="featured-teams-section">
        <span className="eyebrow">Equipos y selecciones</span>
        <h2>Colores que representan historia</h2>

        <div className="teams-grid">
          {featuredTeams.map((team) => (
            <article key={team}>{team}</article>
          ))}
        </div>
      </section>

      <section className="brand-section" id="nosotros">
        <span className="eyebrow">Quiénes somos</span>

        <h2>Una tienda creada para fanáticos</h2>

        <p>
          Jersey Store nace con el objetivo de acercar camisetas de fútbol con
          identidad, diseño y calidad. Creemos que una camiseta no es solo una
          prenda: representa historia, pasión, recuerdos y pertenencia.
        </p>
      </section>

      <section className="benefits-section" id="beneficios">
        <article className="benefit-card">
          <span>⚽</span>
          <h3>Pasión futbolera</h3>
          <p>Productos pensados para quienes viven el fútbol todos los días.</p>
        </article>

        <article className="benefit-card">
          <span>🔥</span>
          <h3>Diseños únicos</h3>
          <p>
            Camisetas con estilo moderno, personalidad y gran presencia visual.
          </p>
        </article>

        <article className="benefit-card">
          <span>🛒</span>
          <h3>Compra simple</h3>
          <p>
            Catálogo, detalle, carrito y pedidos organizados de forma clara.
          </p>
        </article>
      </section>

      <section className="why-us-section">
        <span className="eyebrow">¿Por qué elegirnos?</span>

        <h2>Mucho más que una tienda de camisetas</h2>

        <div className="why-grid">
          <article>
            <span>⚽</span>
            <h3>Pasión</h3>
            <p>
              Cada camiseta representa la historia de un club o una selección.
            </p>
          </article>

          <article>
            <span>🚚</span>
            <h3>Entrega rápida</h3>
            <p>
              Nuestro objetivo es brindar una experiencia de compra ágil y
              sencilla.
            </p>
          </article>

          <article>
            <span>🔒</span>
            <h3>Compra segura</h3>
            <p>
              Tus datos y tu sesión permanecen protegidos durante todo el
              proceso.
            </p>
          </article>

          <article>
            <span>💳</span>
            <h3>Pagos simples</h3>
            <p>
              Una interfaz preparada para integrarse fácilmente con métodos de
              pago.
            </p>
          </article>
        </div>
      </section>

      <section className="home-info-section">
        <div>
          <span className="eyebrow">Nuestra misión</span>
          <h2>Vestir la pasión de cada hincha</h2>
          <p>
            Buscamos que cada cliente encuentre una camiseta que conecte con su
            equipo, su selección o su historia futbolera. Por eso cuidamos la
            presentación visual, la navegación y cada detalle de la experiencia.
          </p>
        </div>

        <img
          src="/Imagenes Camisetas/Neymar Brasil.png"
          alt="Camiseta destacada"
        />
      </section>

      <section className="testimonials-section">
        <span className="eyebrow">Opiniones</span>
        <h2>Lo que dicen nuestros clientes</h2>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name}>
              <p>“{testimonial.text}”</p>
              <h3>{testimonial.name}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-identity-section">
        <span className="eyebrow">Identidad de marca</span>

        <h2>Jersey Store</h2>

        <div className="brand-identity-grid">
          <article>
            <h3>Rubro</h3>
            <p>Tienda online de camisetas de fútbol.</p>
          </article>

          <article>
            <h3>Público objetivo</h3>
            <p>
              Fanáticos del fútbol, coleccionistas y amantes de las camisetas.
            </p>
          </article>

          <article>
            <h3>Eslogan</h3>
            <p>“Donde la pasión por el fútbol se viste con estilo.”</p>
          </article>

          <article>
            <h3>Paleta</h3>
            <p>Negro, rojo y blanco: fuerza, pasión y claridad visual.</p>
          </article>
        </div>
      </section>

      <section className="collection-banner">
        <div>
          <span className="eyebrow">Colección 2026</span>

          <h2>Diseños para vivir cada partido</h2>

          <p>
            Explorá camisetas de clubes y selecciones pensadas para fanáticos
            que sienten el fútbol como parte de su identidad.
          </p>

          <Link to="/productos" className="btn">
            Ver colección
          </Link>
        </div>

        <img src="/Imagenes Camisetas/Honda Japón.png" alt="Colección 2026" />
      </section>

      <section className="promo-banner">
        <div>
          <span className="eyebrow">Promoción destacada</span>
          <h2>Prepará tu colección futbolera</h2>
          <p>
            Explorá camisetas de clubes y selecciones con una experiencia
            rápida, clara y moderna.
          </p>
        </div>

        <Link to="/productos" className="btn">
          Ir al catálogo
        </Link>
      </section>
    </main>
  );
}

export default Home;
