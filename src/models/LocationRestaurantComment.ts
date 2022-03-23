import Sequelize from "sequelize";
import sequelize from "../database";

const LocationRestaurantComment = sequelize.define(
  "location_restaurant_comment",
  {
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
      type: Sequelize.DATE,
      allowNull: false,
    },
  }
);

export default LocationRestaurantComment;
