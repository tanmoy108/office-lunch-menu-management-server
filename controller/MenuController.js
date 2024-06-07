const pool = require("../lib/db");

const d = new Date();
const day = String(d.getDate()).padStart(2, "0");
const month = String(d.getMonth() + 1).padStart(2, "0");
const year = d.getFullYear();
const currentDate = `${year}-${month}-${day}`;

exports.fetchItems = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM menu WHERE date = $1", [currentDate]);
    res.status(200).json(results.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getItem = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await pool.query("SELECT * FROM menu WHERE id = $1", [id]);
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.insertItems = async (req, res) => {
  const { title, description, quantity, type, image } = req.body;
  try {
    const results = await pool.query(
      "INSERT INTO menu(id, title, description, quantity, type, image, date) VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, CURRENT_DATE) RETURNING *",
      [title, description, quantity, type, image]
    );
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.removeItem = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await pool.query("DELETE FROM menu WHERE id = $1 RETURNING *", [id]);
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { title, description, quantity, type, image } = req.body;
  try {
    const results = await pool.query(
      "UPDATE menu SET title = $1, description = $2, quantity = $3, type = $4, image = $5 WHERE id = $6 RETURNING *",
      [title, description, quantity, type, image, id]
    );
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};