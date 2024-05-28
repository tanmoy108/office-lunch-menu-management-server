const pool = require("../lib/db");

exports.fetchItems = async (req, res) => {
  pool.query("SELECT * FROM menu", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};
exports.getItem = async (req, res) => {
  const {id} = req.params;
  pool.query("SELECT * FROM menu WHERE id=$1",[id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
};

exports.insertItems = async (req, res) => {
  const { title, description, quantity, type} = req.body;
  console.log(req.body);
  pool.query(
    "INSERT INTO menu(id, title, description, quantity, type, date) VALUES(uuid_generate_v4(), $1, $2, $3, $4, CURRENT_DATE) RETURNING *",
    [title, description, quantity, type],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results);
      res.status(200).json(results.rows[0]);
    }
  );
};

exports.removeItem = async (req, res) => {
  const {id} = req.params;
  pool.query(
    "DELETE FROM menu WHERE id=$1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows[0]);
    }
  );
};

exports.updateItem = async (req, res) => {
  const {id} = req.params;
  const { title, description, quantity, type} = req.body;
  console.log(req.body);
  pool.query(
    "UPDATE menu SET title=$1, description=$2, quantity=$3, type=$4 WHERE id=$5",
    [title, description, quantity, type, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(results);
      res.status(200).json(results.rows[0]);
    }
  );
};
