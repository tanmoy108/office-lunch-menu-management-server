const pool = require("../lib/db");
exports.checkOTP = async (req, res) => {
  const payload = await req.body;
  console.log(payload)
  const params = req.params["id"];
  console.log(params);

  try {
    const exitingUser = await pool.query("SELECT * from users where id=$1", [
      params,
    ]);
    console.log("exiting",exitingUser)
    if (exitingUser.rows.length<0)
      return res.status(401).json({
        result: "Not Authorized",
        success: false,
      });

    const exitingOtp = await pool.query(
      "SELECT * from verify where user_id=$1 AND otp=$2",
      [params, payload.code.trim()]
    );
    console.log("exitingOtp",exitingOtp)
    if (!exitingOtp)
      return res.status(401).json({
        result: "Invalid OTP",
        success: false,
      });
    const updatedUsers = await pool.query("UPDATE users SET verify=$1 WHERE id=$2 RETURNING *", [
      true,
      exitingOtp.rows[0].user_id,
    ]);
    console.log(updatedUsers);
    await pool.query("DELETE FROM verify WHERE id=$1 AND user_id=$2", [
      exitingOtp.rows[0].id,
      exitingOtp.rows[0].user_id,
    ]);
    return res.status(200).json({ result: "Verified", success: true });
  } catch (error) {
    return res.status(500).json({
      result: "Some Error",
      success: false,
    });
  }
};
