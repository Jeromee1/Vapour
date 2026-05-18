const express = require("express");
const app = express();
const port = 6969;
const cors = require("cors");
const connectDB = require("./connection");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static("public"));

app.use("/users", require("./controllers/users"));
app.use("/games", require("./controllers/games"));
app.use("/cart", require("./controllers/cart"));
app.use("/favorites", require("./controllers/favorites"));
app.use("/wishlist", require("./controllers/wishlist"));
app.use("/orders", require("./controllers/orders"));
app.use("/friends", require("./controllers/friends"));
app.use("/reviews", require("./controllers/reviews"));

connectDB();
app.listen(port, () => console.log(`App is flying on PORT: ${port}`));
