const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (data) => {
  return jwt.sign(
    {
      id: data.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10h",
    }
  );
};

const checkAuth = async (context) => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        const userData = jwt.verify(token, process.env.JWT_SECRET);

        // check if this user still exists in database or not
        // console.log("userData  in checkAuth = ", userData);

        // const user = await User.findById(userData.id);
        const userDoc = await User.findById(userData.id);

        if (!userDoc) {
          throw new AuthenticationError("Invalid / Expired Token");
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

/**
 * ? Maybe instead of throwing error, could just return boolean. Not sure
 */

const checkAdmin = async (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        const userData = jwt.verify(token, process.env.JWT_SECRET);
        // check if this user also exists in the database or not
        // console.log("user data inside check admin : ", userData);

        const userDoc = await User.findById(userData.id);

        // console.log("user doc admin : ", userDoc);
        if (userDoc.role !== "ADMIN") {
          // console.log("should happend");
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
