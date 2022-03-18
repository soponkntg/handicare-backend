import Location from "./location";
import Open from "./open";
import Ramp from "./ramp";
import Toilet from "./toilet";
import Elevator from "./elevator";
import Parking from "./parking";
import Door from "./door";
import LocationImage from "./locationImage";
import Restaurant from "./restaurant";
import LocationRestaurant from "./locationRestaurant";
import sequelize from "../database";
import { storeData } from "../upload/upload";

export {
  Location,
  Open,
  Ramp,
  Toilet,
  Elevator,
  Parking,
  Door,
  LocationImage,
  Restaurant,
  LocationRestaurant,
};
Location.hasMany(Ramp);
Location.hasMany(Toilet);
Location.hasMany(Elevator);
Location.hasMany(Parking);
Location.hasMany(Door);
Location.hasMany(LocationImage);
Location.hasMany(Open);
Location.belongsToMany(Restaurant, { through: LocationRestaurant });
Restaurant.belongsToMany(Location, { through: LocationRestaurant });
Ramp.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });
Toilet.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });
Elevator.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });
Parking.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });
Door.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });
LocationImage.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });
Open.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });

export const initDB = () => {
  sequelize
    // .sync({ force: true })
    .sync()
    .then((result: any) => {
      // console.log(result);
      // storeData();
    })
    .catch((err: any) => {
      console.log(err);
    });
};
