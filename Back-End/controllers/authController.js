const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    User.create(
      nombre,
      email,
      hashedPassword,

      (error, result) => {
        if (error) {
          return res.status(500).json({
            mensaje: "Error al registrar usuario",
          });
        }

        res.status(201).json({
          mensaje: "Usuario registrado correctamente",
        });
      },
    );
  } catch (error) {
    res.status(500).json({
      mensaje: "Error interno",
    });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, async (error, results) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error del servidor",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    const usuario = results[0];

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({
        mensaje: "Contraseña incorrecta",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  });
};
