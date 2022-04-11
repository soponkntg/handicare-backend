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
import User from "./user";
import LocationComment from "./locationComment";
import LocationRestaurantComment from "./LocationRestaurantComment";
import { storeData, storeImage } from "../upload/upload";
import sequelize from "../database";

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
  LocationComment,
  LocationRestaurantComment,
  User,
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
Location.belongsToMany(User, {
  through: { model: LocationComment, unique: false },
  onDelete: "CASCADE",
});
User.belongsToMany(Location, {
  through: { model: LocationComment, unique: false },
  onDelete: "SET NULL",
});
LocationRestaurant.belongsToMany(User, {
  through: { model: LocationRestaurantComment, unique: false },
  onDelete: "CASCADE",
});
User.belongsToMany(LocationRestaurant, {
  through: { model: LocationRestaurantComment, unique: false },
  onDelete: "SET NULL",
});
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
      // storeImage();
    })
    .catch((err: any) => {
      console.log(err);
    });
};
