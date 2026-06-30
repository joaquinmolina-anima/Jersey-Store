const db = require("../config/database");

const User = {
  create: (nombre, email, password, callback) => {
    const sql = `
      INSERT INTO usuarios
      (nombre, email, password)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [nombre, email, password], callback);
  },

  findByEmail: (email, callback) => {
    const sql = `
      SELECT *
      FROM usuarios
      WHERE email = ?
    `;

    db.query(sql, [email], callback);
  },
};

module.exports = User;
