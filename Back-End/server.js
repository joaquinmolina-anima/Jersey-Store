const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/database");

// Rutas
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de productos
app.use("/api/productos", productRoutes);
app.use("/api/pedidos", orderRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    mensaje: "Servidor Jersey Store funcionando",
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
