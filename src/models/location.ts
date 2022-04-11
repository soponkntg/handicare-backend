import Sequelize from "sequelize";
import sequelize from "../database";

const Location = sequelize.define("location", {
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
  googleMap: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  locationDetail: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  contact: {
    type: Sequelize.STRING,
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
    type: Sequelize.DOUBLE,
    defaultValue: 0,
  },
  imageURL: {
    type: Sequelize.STRING,
    // allowNull: false,
  },
  remark: {
    type: Sequelize.STRING,
  },
});

export default Location;
