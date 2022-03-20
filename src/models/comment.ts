import Sequelize from "sequelize";
import sequelize from "../database";

const Comment = sequelize.define("comment", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  rating: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  timestamp: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  profileImageURL: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },

});

export default Comment;
