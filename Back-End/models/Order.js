const db = require("../config/database");

const Order = {
  create: (usuario_id, total, callback) => {
    const sql = `
      INSERT INTO pedidos (usuario_id, total)
      VALUES (?, ?)
    `;

    db.query(sql, [usuario_id, total], callback);
  },

  createDetail: (
    pedido_id,
    producto_id,
    cantidad,
    precio_unitario,
    callback,
  ) => {
    const sql = `
      INSERT INTO detalle_pedido
      (pedido_id, producto_id, cantidad, precio_unitario)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [pedido_id, producto_id, cantidad, precio_unitario],
      callback,
    );
  },

  getAll: (callback) => {
    const sql = `
      SELECT 
        pedidos.id,
        pedidos.total,
        pedidos.estado,
        pedidos.fecha,
        usuarios.nombre AS usuario
      FROM pedidos
      LEFT JOIN usuarios ON pedidos.usuario_id = usuarios.id
      ORDER BY pedidos.id DESC
    `;

    db.query(sql, callback);
  },

  updateStatus: (id, estado, callback) => {
    const sql = `
      UPDATE pedidos
      SET estado = ?
      WHERE id = ?
    `;

    db.query(sql, [estado, id], callback);
  },

  getByUser: (usuario_id, callback) => {
    const sql = `
      SELECT 
        pedidos.id,
        pedidos.total,
        pedidos.estado,
        pedidos.fecha
      FROM pedidos
      WHERE pedidos.usuario_id = ?
      ORDER BY pedidos.id DESC
    `;

    db.query(sql, [usuario_id], callback);
  },

  getDetails: (pedido_id, callback) => {
    const sql = `
      SELECT
        detalle_pedido.id,
        detalle_pedido.pedido_id,
        detalle_pedido.producto_id,
        detalle_pedido.cantidad,
        detalle_pedido.precio_unitario,
        productos.nombre,
        productos.imagen
      FROM detalle_pedido
      LEFT JOIN productos
        ON detalle_pedido.producto_id = productos.id
      WHERE detalle_pedido.pedido_id = ?
    `;

    db.query(sql, [pedido_id], callback);
  },
};

module.exports = Order;
