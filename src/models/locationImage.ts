import Sequelize from "sequelize";
import sequelize from "../database";

const LocationImage = sequelize.define("location_image", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  imageURL: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default LocationImage;
