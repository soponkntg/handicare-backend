import Sequelize from "sequelize";
import sequelize from "../database";

const Toilet = sequelize.define("toilet", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  doorType: {
    type: Sequelize.STRING,
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

export default Toilet;
