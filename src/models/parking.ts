import Sequelize from "sequelize";
import sequelize from "../database";

const Parking = sequelize.define("parking", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  enoughSpace: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  nearEntry: {
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

export default Parking;
