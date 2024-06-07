const pool = require("../lib/db");
const { sendEmail } = require("../lib/sendMail");
const { validate } = require("../lib/validate");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");

exports.createNewAccount = async (req, res) => {
  const payload = req.body;

  try {
    const { error } = validate(payload);
    console.log(error);
    if (error) {
      return res.status(406).json({
        result: error.details[0].message,
        success: false,
      });
    }
    const findEmail = await pool.query("SELECT * FROM users WHERE email=$1", [
      payload.email,
    ]);
    if (findEmail.rows.length>0)
      return res.status(401).json({
        result: "email already used, try another mail",
        success: false,
      });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const newUser = await pool.query(
      "INSERT INTO users(id, name, email, designation, role, password)  VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5) RETURNING *",
      [
        payload.name,
        payload.email,
        payload.designation,
        payload.role,
        hashedPassword,
      ]
    );

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    await pool.query(
      "INSERT INTO verify(id, user_id, otp)  VALUES(uuid_generate_v4(), $1, $2) RETURNING *",
      [newUser.rows[0].id, otp]
    );
    console.log("newUser: ",newUser.rows[0].email);
    await sendEmail({
      email: newUser.rows[0].email,
      subject: "Verify Email",
      text: otp,
    });
    return res.status(200).json({
      result: "a code send to your provided mail",
      success: true,
      id: newUser.rows[0].id,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      result: "Something wrong to sign up",
      success: false,
    });
  }
};
