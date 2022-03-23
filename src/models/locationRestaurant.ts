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
  doorType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imagesURL: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  remark: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  rateAverage: {
    type: Sequelize.DOUBLE,
    defaultValue: 0,
  },
});

export default LocationRestaurant;
