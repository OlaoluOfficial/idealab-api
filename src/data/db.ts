import * as pg from "pg";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DB_URI as string, {
  dialect: "postgres",
  dialectModule: pg,
  define: {
    timestamps: false,
  },
  logging: false,
});

export default sequelize;
