import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
  }
);

const Connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
    console.log("Database Synced");
  } catch (error) {
    console.error("Unable to connect with the database: ", error);
  }
};

export { Connection, sequelize };
