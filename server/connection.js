const mongoose = require("mongoose");

module.exports = async () => {
  try {
    // Paste Connection URL in here 
    await mongoose.connect(`mongodb://mongo:QKffkQWTliXhJpiJHZAiEtHCnKwOvvDD@tramway.proxy.rlwy.net:14928`);
    // await mongoose.connect(`mongodb://localhost/nextjs_project`); Ignore this line
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(`Error connecting to MongoDB: ${e.message}`);
    process.exit(1);
  }
};
