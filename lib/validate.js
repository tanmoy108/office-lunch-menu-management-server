const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity")

exports.validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().required().label("Email"),
    designation: Joi.string().required().label("Designation"),
    role: Joi.string().valid("admin", "employee").required().label("Role"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(data);
};
