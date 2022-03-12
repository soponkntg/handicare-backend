import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class Location extends Model {
  declare id: number;
  declare name: string;
  declare category: string;
  declare googleMap: string;
  declare locationDetail: string;
  declare lat: string;
  declare lng: string;
  declare count: number;
  declare rateAverage: number;
  declare imageURL: string;
  declare remark: string;
}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    googleMap: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    locationDetail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    lng: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rateAverage: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    imageURL: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    remark: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: "location",
  }
);

export default Location;
