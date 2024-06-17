const pool = require("../lib/db");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const { sendEmail } = require("../lib/sendMail");
const jwt = require("jsonwebtoken");

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });

  return schema.validate(data);
};

exports.loginAccount = async (req, res) => {
  const payload = req.body;

  try {
    const { error } = validate(payload);
    console.log("any error", error);
    if (error) {
      console.error("Validation error details:", error.details);
      return res.status(401).json({
        result: error.details[0].message,
        details: error.details,
        success: false,
      });
    }

    const Users = await pool.query("SELECT * from users WHERE email=$1", [
      payload.email,
    ]);

    if (!Users.rows.length) {
      return res.status(401).json({ result: "invalid email ", success: false });
    }

    if (!Users.rows[0].password) {
      return res.status(401).json({ result: "not authorized", success: false });
    }
    const validPassword = await bcrypt.compare(
      payload.password,
      Users.rows[0].password
    );

    if (!validPassword) {
      return res
        .status(401)
        .json({ result: "invalid password", success: false });
    }

    if (!Users.rows[0].verify) {
      const userOtp = await pool.query(
        "SELECT * FROM verify WHERE user_id=$1",
        [Users.rows[0].id]
      );
      if (!userOtp) {
        const otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          specialChars: false,
        });
        await pool.query(
          "INSERT INTO verify(id, user_id, otp)  VALUES(uuid_generate_v4(), $1, $2) RETURNING *",
          [Users.rows[0].id, otp]
        );

        await sendEmail({
          email: Users.rows[0].email,
          subject: "Verify Email",
          text: otp,
        });
        return res.status(200).json({
          result: "a code send to your mail",
          success: true,
          id: Users.rows[0].id,
        });
      }
    } else {
      const user = Users.rows[0];
      const tokenPayload = { id: user.id, role: user.role };
      const jwtSecret =process.env.JWT_SECRET;
      const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: "1d" });
      const maxAge = 24 * 60 * 60 * 1000;
      res.cookie("access_token", token, {
        httpOnly: process.env.NODE_ENV === 'production' ? true : false,
        secure: process.env.NODE_ENV === 'production' ? true : false, 
        // sameSite: "none",
        maxAge: maxAge 
      });

      return res.status(200).json({
        result: "Login Successfully",
        success: true
      });
    }
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ result: "errors: " + error, success: false });
  }
};
