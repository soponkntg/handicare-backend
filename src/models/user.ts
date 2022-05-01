import Sequelize from "sequelize";
import sequelize from "../database";

const User = sequelize.define("user", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  profileImageURL: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  loginOption: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default User;
