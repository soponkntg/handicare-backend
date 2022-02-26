import Sequelize from "sequelize";
import sequelize from "../database";

const LocationResteraunt = sequelize.define("location_resteraunt", {
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
    allowNull: false,
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

export default LocationResteraunt;
