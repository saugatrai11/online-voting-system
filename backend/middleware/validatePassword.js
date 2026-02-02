module.exports = (req, res, next) => {
  const { password } = req.body;

  // Regex: 8+ chars, at least 1 uppercase, 1 lowercase, 1 number, and 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      msg: "Password is too weak. It must be at least 8 characters long and include an uppercase letter, a number, and a special character (@$!%*?&)."
    });
  }

  next();
};