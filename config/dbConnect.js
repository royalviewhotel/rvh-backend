const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  const conn = mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = dbConnect;
