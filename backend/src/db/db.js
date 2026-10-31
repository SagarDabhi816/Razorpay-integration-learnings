const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_URL).then(() => {
      console.log("Database Connected");
    });
  } catch (error) {
    console.error("Error while connecting to the database", error);
    process.exit(1);
  }
}

module.exports = connectToDatabase;

