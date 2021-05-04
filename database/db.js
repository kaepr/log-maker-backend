const mongoose = require("mongoose");

const connectDB = async () => {
 

  const conn = await mongoose.connect(`${process.env.MONGO_URI}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB successfully connected : ${conn.connection.host}`);
};

module.exports = connectDB;
