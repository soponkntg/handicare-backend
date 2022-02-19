import Sequelize from "sequelize";
import sequelize from "../database";

const Location = sequelize.define("location", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  locationName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  locationCategory: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  googleMap: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  locationDetail: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lat: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  lng: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  rateAverage: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  openTime: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  closeTime: {
    type: Sequelize.TIME,
    allowNull: false,
  },
  openDate: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  locationImage: {
    type: Sequelize.STRING,
    allowNUll: false,
  },
});

export default Location;
