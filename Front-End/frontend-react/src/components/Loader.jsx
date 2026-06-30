function Loader({ text = "Cargando..." }) {
  return (
    <main className="loader-page">
      <div className="loader-card">
        <img src="/Imagenes Camisetas/logo256.ico" alt="Jersey Store" />

        <div className="loader-spinner"></div>

        <p>{text}</p>
      </div>
    </main>
  );
}

export default Loader;
