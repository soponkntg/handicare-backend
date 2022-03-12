import Location from "./location";
import Ramp from "./ramp";
import Toilet from "./toilet";
import Elevator from "./elevator";
import Parking from "./parking";
import Door from "./door";
import Image from "./image";
import Resteraunt from "./restaurant";
import LocationResteraunt from "./locationRestaurnat";
import Open from "./open";
import sequelize from "../database";
import { storeData } from "../upload/upload";

export {
  Location,
  Ramp,
  Toilet,
  Elevator,
  Parking,
  Door,
  Image,
  Resteraunt,
  LocationResteraunt,
};
Location.hasMany(Ramp);
Location.hasMany(Toilet);
Location.hasMany(Elevator);
Location.hasMany(Parking);
Location.hasMany(Door);
Location.hasMany(Image);
Location.hasMany(Open);
Location.belongsToMany(Resteraunt, { through: LocationResteraunt });
Resteraunt.belongsToMany(Location, { through: LocationResteraunt });
Ramp.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });
Toilet.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });
Elevator.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });
Parking.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });
Door.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });
Image.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });
Open.belongsTo(Location, { constraints: true, onDelete: "CASCADE" });

export const initDB = () => {
  sequelize
    .sync({ force: true })
    // .sync()
    .then((result: any) => {
      console.log(result);
      storeData();
    })
    .catch((err: any) => {
      console.log(err);
    });
};
