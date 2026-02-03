const { z } = require("zod");

// Schema for registration
const registerSchema = z.object({
  name: z.string().min(3, "Name must be 3+ chars"),
  email: z.string().email("Invalid email format"),
  username: z.string().min(4),
  phone: z.string().min(10),
  password: z.string().min(8, "Password must be 8+ chars"),
});

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (e) {
    return res.status(400).json({ msg: e.errors[0].message });
  }
};

module.exports = { validate, registerSchema };