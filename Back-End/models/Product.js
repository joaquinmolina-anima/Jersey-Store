const db = require("../config/database");

const Product = {
  create: (nombre, descripcion, precio, imagen, stock, categoria, callback) => {
    const sql = `
      INSERT INTO productos
      (
        nombre,
        descripcion,
        precio,
        imagen,
        stock,
        categoria
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [nombre, descripcion, precio, imagen, stock, categoria],
      callback,
    );
  },

  getAll: (callback) => {
    const sql = `
      SELECT *
      FROM productos
      WHERE activo = 1
      ORDER BY id DESC
    `;

    db.query(sql, callback);
  },

  update: (
    id,
    nombre,
    descripcion,
    precio,
    imagen,
    stock,
    categoria,
    callback,
  ) => {
    const sql = `
      UPDATE productos
      SET
        nombre = ?,
        descripcion = ?,
        precio = ?,
        imagen = ?,
        stock = ?,
        categoria = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [nombre, descripcion, precio, imagen, stock, categoria, id],
      callback,
    );
  },

  delete: (id, callback) => {
    const sql = `
      UPDATE productos
      SET activo = 0
      WHERE id = ?
    `;

    db.query(sql, [id], callback);
  },
};

module.exports = Product;
