import Sequelize from "sequelize";
import sequelize from "../database";

const Door = sequelize.define("door", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  doorType: {
    type: Sequelize.STRING,
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

export default Door;
