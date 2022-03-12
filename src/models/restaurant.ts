import Sequelize from "sequelize";
import sequelize from "../database";

const Resteraunt = sequelize.define("resteraunt", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  logoURL: {
    type: Sequelize.STRING,
    // allowNull: false,
  },
});

export default Resteraunt;
