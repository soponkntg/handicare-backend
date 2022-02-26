import Sequelize from "sequelize";
import sequelize from "../database";

const Ramp = sequelize.define("ramp", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  slope: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  level: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  handrail: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  located: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  floor: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  remark: Sequelize.STRING,
});

export default Ramp;
