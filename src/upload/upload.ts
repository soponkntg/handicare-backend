import fs from "fs";
import csv from "csv-parser";
import path from "path";
import Location from "../models/location";
import Resteraunt from "../models/restaurant";
const locationData: any = [];
const locationResterauntData: any = [];
const toiletData: any = [];
const liftData: any = [];
const parkingData: any = [];
const rampData: any = [];

export const storeData = async () => {
  fs.createReadStream(path.join(__dirname, "location.csv"))
    .pipe(csv())
    .on("data", (row) => {
      const data = {
        name: row["Name"],
        category: row["Category"],
        googleMap: row["Google Map URL"],
        lat: +row["Lat"],
        lng: +row["Lng"],
        locationDetail: row["Location Detail"],
        remark: row["Remarks"],
      };
      locationData.push(data);
    })
    .on("end", async () => {
      console.log(locationData);

      //insert to location table
      const locations = await Location.bulkCreate(locationData);
      console.log(locations);

      fs.createReadStream(path.join(__dirname, "location_resteraunt.csv"))
        .pipe(csv())
        .on("data", async (row) => {
          ////read locationResteraunt file

          const data = {
            locationName: row["Location_Name"],
            name: row["Restaurant _Name"],
            category: row["Category"],
            level: +row["Level"],
            located: row["Located"],
            floor: row["Floor"],
            logoURL: row["URL"],
          };
          locationResterauntData.push(data);
        })
        // .on("end", async () => {
        //   fs.createReadStream("toilet.csv")
        //     .pipe(csv())
        //     .on("data", (row) => {
        //       // read toilet table

        //       const data = {
        //         locationName: row["Location_Name"],
        //         type: row["Type"],
        //         doorType: row["Door Type"],
        //         handrail: row["Handrail"],
        //         located: row["Located"],
        //         floor: row["Floor"],
        //         remark: row["Remark"],
        //       };
        //       toiletData.push(data);
        //     })
        //   .on("end", () => {
        //     fs.createReadStream("lift.csv")
        //       .pipe(csv())
        //       .on("data", (row) => {

        //// read lift table

        //         const data = {
        //           locationName: row["Location_Name"],
        //           switch: row["Type"],
        //           doorType: row["Wheel Chair Switch"],
        //           passable: row["Passable"],
        //           located: row["Located"],
        //           floor: row["Floor"],
        //           remark: row["Remark"],
        //         };
        //         liftData.push(data);
        //       })
        //       .on("end", () => {
        //         fs.createReadStream("parking.csv")
        //           .pipe(csv())
        //           .on("data", (row) => {

        //// read parking table

        //             const data = {
        //               locationName: row["Location_Name"],
        //               enoughSpace: row["Enough Space"],
        //               nearEntry: row["Near Entry"],
        //               located: row["Located"],
        //               floor: row["Floor"],
        //               remark: row["Remark"],
        //             };
        //             parkingData.push(data);
        //           })
        //           .on("end", () => {
        //             fs.createReadStream("ramp.csv")
        //               .pipe(csv())
        //               .on("data", (row) => {

        //// read ramp table

        //                 const data = {
        //                   locationName: row["Location_Name"],
        //                   slope: row["Slope"],
        //                   level: +row["Level"],
        //                   handrail: row["Handrail"],
        //                   located: row["Located"],
        //                   floor: row["Floor"],
        //                   remark: row["Remark"],
        //                 };
        //                 rampData.push(data);
        //               })
        .on("end", async () => {
          console.log(locationResterauntData);
          for (let locationResteraunt of locationResterauntData) {
            const location = await Location.findOne({
              where: {
                name: locationResteraunt.locationName,
              },
            });
            if (location) {
              let resteraunt = await Resteraunt.findAll({
                where: { name: locationResteraunt.name },
              });
              if (!resteraunt) {
                resteraunt = await Resteraunt.create({
                  name: locationResteraunt.name,
                  category: locationResteraunt.category,
                  // logoURL: locationResteraunt.logoURL
                });
              }
            }
          }
        });
      //           });
      //       });
      //   });
      // });
    });
};
