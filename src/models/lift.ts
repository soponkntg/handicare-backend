import Sequelize from "sequelize";
import sequelize from "../database";

const Lift = sequelize.define("lift", {
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
  floor: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  remark: Sequelize.STRING,
});

export default Lift;
