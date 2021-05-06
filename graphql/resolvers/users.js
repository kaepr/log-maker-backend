const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server-express");
const {
  formatYupError,
  loginSchema,
  registerSchema,
  updateSchema,
} = require("../../validators");

const {
  generateToken,
  checkAdmin,
  checkAuth,
} = require("../../utils/authHelper");

module.exports = {
  Query: {
    async getUsers(_, __, context, info) {
      // console.log("inside get users");
      const user = await checkAdmin(context);

      // console.log("user = ", user);

      // console.log("user data from token = ", user);
      // const userExists = await User.findById(user.id);

      // if (!userExists) {
      //   throw new Error("User does not exist");
      // }

      try {
        return await User.find().sort({ createdAt: -1 });
      } catch (err) {
        throw new Error(err);
      }
    },
    async getCurrentUser(_, __, context, info) {
      const user = await checkAuth(context);

      // console.log("user = ", user);

      // console.log("user data from token = ", user);
      // const userExists = await User.findById(user.id);

      // if (!userExists) {
      //   throw new Error("User does not exist");
      // }

      console.log("user = ", user);

      try {
        return await User.findById(user.id);
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async login(_, { input }, context, info) {
      try {
        await loginSchema.validate(input, { abortEarly: false });
      } catch (err) {
        let errors = formatYupError(err);
        throw new UserInputError("Errors", {
          errors: errors,
        });
      }

      const { email, password } = input;

      const user = await User.findOne({ email });

      if (!user) {
        throw new UserInputError("User not found", {
          errors: [
            {
              general: "User not found",
            },
          ],
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new UserInputError("Wrong credentials", {
          errors: [
            {
              general: "Password do not match",
            },
          ],
        });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(_, { input }, context, info) {
      const userData = await checkAdmin(context);

      try {
        await registerSchema.validate(input, { abortEarly: false });
      } catch (err) {
        let errors = formatYupError(err);
        throw new UserInputError("Errors", {
          errors: errors,
        });
      }

      const { fullname, role, password, confirmpassword, email } = input;

      if (role !== "USER" && role !== "ADMIN") {
        throw new UserInputError("Role is not defined", {
          errors: [
            {
              role: "Role not defined",
            },
          ],
        });
      }

      if (password !== confirmpassword) {
        throw new UserInputError("Passwords do not match", {
          errors: [
            {
              password: "Password do not match",
            },
          ],
        });
      }

      const user = await User.findOne({ email });
      if (user) {
        throw new UserInputError("Email is taken", {
          errors: [
            {
              email: "This email is taken",
            },
          ],
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email,
        fullname,
        role,
        password: hashPassword,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      // console.log("res = ", res);
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    async updateUser(_, { input }, context, info) {
      try {
        await updateSchema.validate(input, { abortEarly: false });
      } catch (err) {
        let errors = formatYupError(err);
        throw new UserInputError("Errors", {
          errors: errors,
        });
      }

      const { fullname, role, password, email, id } = input;

      if (role !== "USER" && role !== "ADMIN") {
        throw new UserInputError("Role is not defined", {
          errors: [
            {
              role: "Role not defined",
            },
          ],
        });
      }

      const oldUserInfo = await User.findById(id);

      if (!oldUserInfo) {
        throw new Error("User with given id does not exist");
      }

      // Check if email is still unique
      const checkEmail = await User.find({ email });
      console.log("user with this mail = ", checkEmail);

      if (checkEmail.length > 1) {
        throw new Error("User with email already exists");
      }

      if (checkEmail.length == 1 && checkEmail[0].id !== id) {
        // email alreadys exists, and the id does not match
        // thus its a different account with same email
        throw new Error("User with email already exists");
      }

      // assuming passwords did not change, hashPassword will remain the same
      let hashPassword = oldUserInfo.password;

      const match = await bcrypt.compare(password, oldUserInfo.password);

      if (!match) {
        // New password, generate a new hash
        // console.log("password changed");
        hashPassword = await bcrypt.hash(password, 10);
      }

      await User.findByIdAndUpdate(id, {
        fullname,
        role,
        password: hashPassword,
        email,
      });

      const res = await User.findById(id);
      // console.log("res = ", res);
      return res;
    },
  },
};
