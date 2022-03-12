import Sequelize from "sequelize";
import sequelize from "../database";

// class Location extends Model {
//   declare id: number;
//   declare name: string;
//   declare category: string;
//   declare googleMap: string;
//   declare locationDetail: string;
//   declare lat: string;
//   declare lng: string;
//   declare count:number;
//   declare rateAverage:number;
//   declare imageURL:string;
//   declare remark: string ;
// }
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
