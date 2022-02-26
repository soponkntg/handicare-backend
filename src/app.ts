import express from "express";
import dotenv from "dotenv";
import sequelize from "./database";
import Location from "./models/location";
import Ramp from "./models/ramp";
import Toilet from "./models/toilet";
import Lift from "./models/lift";
import Parking from "./models/parking";
import Door from "./models/door";
import Image from "./models/image";
import Resteraunt from "./models/restaurant";
import LocationResteraunt from "./models/locationRestaurnat";
import { storeData } from "./upload/upload";
import Open from "./models/open";

dotenv.config();
const app = express();

Location.hasMany(Ramp);
Location.hasMany(Toilet);
Location.hasMany(Lift);
Location.hasMany(Parking);
Location.hasMany(Door);
Location.hasMany(Image);
Location.hasMany(Open);
Location.belongsToMany(Resteraunt, { through: LocationResteraunt });
Resteraunt.belongsToMany(Location, { through: LocationResteraunt });
Ramp.belongsTo(Location, { constraints: true, onDelte: "CASCADE" });
Toilet.belongsTo(Location, { constraints: true, onDelte: "CASCADE" });
Lift.belongsTo(Location, { constraints: true, onDelte: "CASCADE" });
Parking.belongsTo(Location, { constraints: true, onDelte: "CASCADE" });
Door.belongsTo(Location, { constraints: true, onDelte: "CASCADE" });
Image.belongsTo(Location, { constraints: true, onDelte: "CASCADE" });
Open.belongsTo(Location, { constraints: true, onDelte: "CASCADE" });

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
