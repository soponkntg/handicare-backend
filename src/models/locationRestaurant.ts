import Sequelize from "sequelize";
import sequelize from "../database";

const LocationRestaurant = sequelize.define("location_restaurant", {
  located: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  floor: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  level: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageURL: {
    type: Sequelize.STRING,
    //   allowNull: false,
  },
});

export default LocationRestaurant;
