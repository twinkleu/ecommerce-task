import express from "express";
import dotenv from "dotenv";
import { Connection } from "./config/db.js";
import { initializeModels } from "./models/index.js";
import router from "./routes/router.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(router);

const startServer = async () => {
  await Connection();
  await initializeModels();

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

startServer();
