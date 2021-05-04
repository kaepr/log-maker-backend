const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server-express");
const {
  formatYupError,
  loginSchema,
  registerSchema,
} = require("../../validators");

const { generateToken } = require("../../utils/authHelper");

module.exports = {
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

      console.log("res = ", res);
      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
