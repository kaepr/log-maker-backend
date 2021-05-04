const { AuthenticationError } = require("apollo-server-express");
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

const checkAuth = (context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        const userData = jwt.verify(token, process.env.JWT_SECRET);
        return userData;
      } catch (err) {
        throw new AuthenticationError("Invalid / Expired Token");
      }
    }

    throw new Error("Authentication token is incorrect");
  }

  throw new Error("Authorization Header must be present");
};

/**
 * ? Maybe instead of throwing error, could just return boolean. Not sure
 */

const checkAdmin = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        const userData = jwt.verify(token, process.env.JWT_SECRET);
        console.log("user from token in checkAdmin = ", userData);
        if (userData.role !== "ADMIN") {
          throw new Error("Access not granted");
        }
        return userData;
      } catch (err) {
        throw new AuthenticationError("Invalid / Expired Token");
      }
    }

    throw new Error("Authentication token is incorrect");
  }

  throw new Error("Authorization Header must be present");
};

module.exports = {
  checkAuth,
  generateToken,
  checkAdmin,
};
