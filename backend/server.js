require("dotenv").config();
const connectToDatabase =  require("./src/db/db");
const app = require("./src/app");
const Port = process.env.PORT;

connectToDatabase();

app.listen(Port, () => {
  console.log(`Server Running on Port ${Port}`);
});
