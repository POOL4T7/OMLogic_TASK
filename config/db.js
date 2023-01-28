const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URL ||
        'mongodb://gulshan:1alyxstar@localhost:27017/omlogic?authSource=admin',
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
    console.log('mongoDB connected: ', conn.connection.host);
  } catch (e) {
    console.log(e.message);
    process.exit();
  }
};

module.exports = connectDB;
