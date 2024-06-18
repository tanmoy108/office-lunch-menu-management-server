const pool = require("../lib/db");

exports.getUserInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT name,email,designation FROM users WHERE id=$1",
      [id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
