import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

import sequelize from "./database";
import Location from "./models/location";
import Ramp from "./models/ramp";
import Toilet from "./models/toilet";
import Elevator from "./models/elevator";
import Parking from "./models/parking";
import Door from "./models/door";
import Image from "./models/image";
import Resteraunt from "./models/restaurant";
import LocationResteraunt from "./models/locationRestaurnat";
import { storeData } from "./upload/upload";
import Open from "./models/open";

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

sequelize
  .sync({ force: true })
  // .sync()
  .then((result: any) => {
    console.log(result);
    storeData();
    const port = process.env.PORT || 4000;
    app.listen(port, () =>
      console.log(`Listening on http://localhost:${port}`)
    );
  })
  .catch((err: any) => {
    console.log(err);
  });
