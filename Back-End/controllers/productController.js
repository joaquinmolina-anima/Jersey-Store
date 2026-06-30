const Product = require("../models/Product");

exports.createProduct = (req, res) => {
  const { nombre, descripcion, precio, imagen, stock, categoria } = req.body;

  Product.create(
    nombre,
    descripcion,
    precio,
    imagen,
    stock,
    categoria,
    (error, result) => {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al crear producto",
        });
      }

      res.status(201).json({
        mensaje: "Producto creado correctamente",
      });
    },
  );
};

exports.getProducts = (req, res) => {
  Product.getAll((error, results) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al obtener productos",
      });
    }

    res.json(results);
  });
};

exports.deleteProduct = (req, res) => {
  const id = req.params.id;

  Product.delete(id, (error, result) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al eliminar producto",
      });
    }

    res.json({
      mensaje: "Producto eliminado correctamente",
    });
  });
};

exports.updateProduct = (req, res) => {
  const id = req.params.id;

  const { nombre, descripcion, precio, imagen, stock, categoria } = req.body;

  Product.update(
    id,
    nombre,
    descripcion,
    precio,
    imagen,
    stock,
    categoria,
    (error, result) => {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al actualizar producto",
        });
      }

      res.json({
        mensaje: "Producto actualizado correctamente",
      });
    },
  );
};
