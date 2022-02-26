import Sequelize from "sequelize";
import sequelize from "../database";

const Open = sequelize.define("open", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  day: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  open: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  openTime: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  closeTime: {
    type: Sequelize.TIME,
    allowNull: false,
  },
});

export default Open;
