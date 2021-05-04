const jwt = require("jsonwebtoken");

const generateToken = (data) => {
  return jwt.sign(
    {
      id: data.id,
      email: data.email,
      fullname: data.fullname,
      role: data.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10h",
    }
  );
};

module.exports = {
  generateToken,
};
