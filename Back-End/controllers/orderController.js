const Order = require("../models/Order");

exports.createOrder = (req, res) => {
  const { usuario_id, carrito, total } = req.body;

  if (!carrito || carrito.length === 0) {
    return res.status(400).json({
      mensaje: "El carrito está vacío",
    });
  }

  Order.create(usuario_id, total, (error, result) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al crear pedido",
      });
    }

    const pedido_id = result.insertId;

    carrito.forEach((producto) => {
      Order.createDetail(
        pedido_id,
        producto.id,
        producto.cantidad || 1,
        producto.precio,
        () => {},
      );
    });

    res.status(201).json({
      mensaje: "Pedido creado correctamente",
      pedido_id,
    });
  });
};

exports.getOrders = (req, res) => {
  Order.getAll((error, results) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al obtener pedidos",
      });
    }

    res.json(results);
  });
};

exports.updateOrderStatus = (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;

  Order.updateStatus(id, estado, (error, result) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al actualizar estado",
      });
    }

    res.json({
      mensaje: "Estado actualizado correctamente",
    });
  });
};

exports.getOrdersByUser = (req, res) => {
  const usuario_id = req.params.usuario_id;

  Order.getByUser(usuario_id, (error, results) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al obtener pedidos del usuario",
      });
    }

    res.json(results);
  });
};

exports.getOrderDetails = (req, res) => {
  const pedido_id = req.params.id;

  Order.getDetails(pedido_id, (error, results) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al obtener detalle del pedido",
      });
    }

    res.json(results);
  });
};
