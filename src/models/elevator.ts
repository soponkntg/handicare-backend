import Sequelize from "sequelize";
import sequelize from "../database";

const Elevator = sequelize.define("elevator", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  switch: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  passable: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  located: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  remark: Sequelize.STRING,
});

export default Elevator;
