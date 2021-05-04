const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

        // check if this user still exists in database or not
        console.log("userData  in checkAuth = ", userData);
        // const user = await User.findById(userData.id);

        return userData;
      } catch (err) {
        console.log("happens");
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
        // check if this user also exists in the database or not
        // console.log("user data inside check admin : ", userData);
        if (userData.role !== "ADMIN") {
          console.log("should happend");
          throw new AuthenticationError("Access not granted");
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
