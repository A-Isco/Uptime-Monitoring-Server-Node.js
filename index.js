const app = require("./app");
const connectDB = require("./db/connectDB");
require("dotenv").config();
const cronService = require("./services/cronService");

// Port
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

// Start Server
startServer();

// Start Monitoring Process
cronService.startMonitoringProcess();
