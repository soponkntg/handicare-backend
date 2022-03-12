import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { Location, Restaurant, LocationRestaurant } from "../models/index";
const locationData: any = [];
const locationRestaurantData: any = [];
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

      fs.createReadStream(path.join(__dirname, "location_restaurant.csv"))
        .pipe(csv())
        .on("data", async (row) => {
          ////read locationRestaurant file

          const data = {
            locationName: row["Location_Name"],
            name: row["Restaurant _Name"],
            category: row["Category"],
            level: +row["Level"],
            located: row["Located"],
            floor: row["Floor"],
            logoURL: row["URL"],
          };
          locationRestaurantData.push(data);
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
          console.log(locationRestaurantData);
          for (let locationRestaurant of locationRestaurantData) {
            const location = await Location.findOne({
              where: {
                name: locationRestaurant.locationName,
              },
            });
            if (location) {
              let restaurant = await Restaurant.findOne({
                where: { name: locationRestaurant.name },
              });
              if (!restaurant) {
                restaurant = await Restaurant.create({
                  name: locationRestaurant.name,
                  category: locationRestaurant.category,
                  // logoURL: locationRestaurant.logoURL
                });
              }
              location.addRestaurant();
              // const resterauntInLocation = await LocationRestaurant.create({
              //   locationId: location.toJSON().id,
              //   restaurantId: restaurant.toJSON().id,
              //   located: locationRestaurant.located,
              //   floor: locationRestaurant.floor,
              //   count: locationRestaurant.count,
              //   level: locationRestaurant.level,
              //   // imageURL:locationRestaurant.imageURL,
              // });
              // console.log(resterauntInLocation);
              // const l = await Location.findOne({
              //   where: {
              //     name: locationRestaurant.locationName,
              //   },
              // });
            }
          }
        });
      //           });
      //       });
      //   });
      // });
    });
};
