import fs from "fs";
import csv from "csv-parser";
import path from "path";
import {
  Location,
  Restaurant,
  LocationRestaurant,
  Open,
  Door,
  Toilet,
  Elevator,
  Parking,
  Ramp,
} from "../models/index";
const locationsData: any = [];
const opensData: any = [];
const locationRestaurantsData: any = [];
const doorsData: any = [];
const toiletsData: any = [];
const elevatorsData: any = [];
const parkingsData: any = [];
const rampsData: any = [];

export const storeData = async () => {
  console.log("--INIT DATABASE--");
  fs.createReadStream(path.join(__dirname, "collection/location.csv"))
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
      locationsData.push(data);
    })
    .on("end", async () => {
      fs.createReadStream(
        path.join(__dirname, "collection/location_restaurant.csv")
      )
        .pipe(csv())
        .on("data", async (row) => {
          //read locationRestaurant file

          const data = {
            locationName: row["Location_Name"],
            name: row["Restaurant_Name"],
            category: row["Category"],
            level: +row["Level"],
            located: row["Located"],
            floor: row["Floor"],
            imagesURL: row["Images URL"],
            remark: row["Remark"],
            logoURL: row["Logo URL"],
          };
          locationRestaurantsData.push(data);
        })
        .on("end", async () => {
          fs.createReadStream(path.join(__dirname, "collection/open.csv"))
            .pipe(csv())
            .on("data", async (row) => {
              // read open file

              const data = {
                locationName: row["Location_Name"],
                day: row["Day"],
                open: toBoolean(row["Open"]),
                openTime: row["Open Time"],
                closeTime: row["Close Time"],
              };
              opensData.push(data);
            })
            .on("end", async () => {
              fs.createReadStream(path.join(__dirname, "collection/ramp.csv"))
                .pipe(csv())
                .on("data", async (row) => {
                  // read ramp file

                  const data = {
                    locationName: row["Location_Name"],
                    slope: row["Slope"],
                    level: +row["Level"],
                    handrail: toBoolean(row["Handrail"]),
                    located: row["Located"],
                    floor: row["Floor"],
                    remark: row["Remark"],
                  };
                  rampsData.push(data);
                })
                .on("end", async () => {
                  fs.createReadStream(
                    path.join(__dirname, "collection/door.csv")
                  )
                    .pipe(csv())
                    .on("data", async (row) => {
                      // read door file

                      const data = {
                        locationName: row["Location_Name"],
                        doorType: row["Door Type"],
                        passable: toBoolean(row["Passable"]),
                        located: row["Located"],
                        floor: row["Floor"],
                        remark: row["Remark"],
                      };
                      doorsData.push(data);
                    })
                    .on("end", async () => {
                      fs.createReadStream(
                        path.join(__dirname, "collection/toilet.csv")
                      )
                        .pipe(csv())
                        .on("data", async (row) => {
                          // read toilet file

                          const data = {
                            locationName: row["Location_Name"],
                            type: row["Type"],
                            doorType: row["Door Type"],
                            handrail: toBoolean(row["Handrail"]),
                            located: row["Located"],
                            floor: row["Floor"],
                            remark: row["Remark"],
                          };
                          toiletsData.push(data);
                        })
                        .on("end", async () => {
                          fs.createReadStream(
                            path.join(__dirname, "collection/elevator.csv")
                          )
                            .pipe(csv())
                            .on("data", async (row) => {
                              // read elevator file

                              const data = {
                                locationName: row["Location_Name"],
                                switch: toBoolean(row["Wheel Chair Switch"]),
                                passable: toBoolean(row["Passable"]),
                                located: row["Located"],
                                remark: row["Remark"],
                              };
                              elevatorsData.push(data);
                            })
                            .on("end", async () => {
                              fs.createReadStream(
                                path.join(__dirname, "collection/parking.csv")
                              )
                                .pipe(csv())
                                .on("data", async (row) => {
                                  // read parking file

                                  const data = {
                                    locationName: row["Location_Name"],
                                    enoughSpace: toBoolean(row["Enough Space"]),
                                    nearEntry: toBoolean(row["Near Entry"]),
                                    located: row["Located"],
                                    floor: row["Floor"],
                                    remark: row["Remark"],
                                  };
                                  parkingsData.push(data);
                                })
                                .on("end", async () => {
                                  //insert to location table with others

                                  for (let locationData of locationsData) {
                                    //open
                                    const opensInLocation = opensData.filter(
                                      (open: any) =>
                                        open.locationName === locationData.name
                                    );
                                    const opens = opensInLocation.map(
                                      (open: any) => {
                                        return {
                                          day: open.day,
                                          open: open.open,
                                          openTime: open.openTime,
                                          closeTime: open.closeTime,
                                        };
                                      }
                                    );

                                    //ramps
                                    const rampsInLocation = rampsData.filter(
                                      (ramp: any) =>
                                        ramp.locationName === locationData.name
                                    );
                                    const ramps = rampsInLocation.map(
                                      (ramp: any) => {
                                        return {
                                          slope: ramp.slope,
                                          level: ramp.level,
                                          handrail: ramp.handrail,
                                          located: ramp.located,
                                          floor: ramp.floor,
                                          remark: ramp.remark,
                                        };
                                      }
                                    );

                                    //doors
                                    const doorsInLocation = doorsData.filter(
                                      (door: any) =>
                                        door.locationName === locationData.name
                                    );
                                    const doors = doorsInLocation.map(
                                      (door: any) => {
                                        return {
                                          doorType: door.doorType,
                                          passable: door.passable,
                                          located: door.located,
                                          floor: door.floor,
                                          remark: door.remark,
                                        };
                                      }
                                    );

                                    //toilet
                                    const toiletsInLocation =
                                      toiletsData.filter(
                                        (toilet: any) =>
                                          toilet.locationName ===
                                          locationData.name
                                      );
                                    const toilets = toiletsInLocation.map(
                                      (toilet: any) => {
                                        return {
                                          type: toilet.type,
                                          doorType: toilet.doorType,
                                          handrail: toilet.handrail,
                                          located: toilet.located,
                                          floor: toilet.floor,
                                          remark: toilet.remark,
                                        };
                                      }
                                    );

                                    //elevator
                                    const elevatorsInLocation =
                                      elevatorsData.filter(
                                        (elevator: any) =>
                                          elevator.locationName ===
                                          locationData.name
                                      );
                                    const elevators = elevatorsInLocation.map(
                                      (elevator: any) => {
                                        return {
                                          switch: elevator.switch,
                                          passable: elevator.passable,
                                          located: elevator.located,
                                          remark: elevator.remark,
                                        };
                                      }
                                    );

                                    //parking
                                    const parkingsInLocation =
                                      parkingsData.filter(
                                        (parking: any) =>
                                          parking.locationName ===
                                          locationData.name
                                      );
                                    const parkings = parkingsInLocation.map(
                                      (parking: any) => {
                                        return {
                                          enoughSpace: parking.enoughSpace,
                                          nearEntry: parking.nearEntry,
                                          located: parking.located,
                                          floor: parking.floor,
                                          remark: parking.remark,
                                        };
                                      }
                                    );

                                    //insert
                                    const location = await Location.create(
                                      {
                                        ...locationData,
                                        opens: opens,
                                        ramps: ramps,
                                        doors: doors,
                                        toilets: toilets,
                                        elevators: elevators,
                                        parkings: parkings,
                                      },
                                      {
                                        include: [
                                          Open,
                                          Ramp,
                                          Door,
                                          Toilet,
                                          Elevator,
                                          Parking,
                                        ],
                                      }
                                    );
                                  }

                                  // console.log(locationRestaurantsData);
                                  for (let locationRestaurantData of locationRestaurantsData) {
                                    const location = await Location.findOne({
                                      where: {
                                        name: locationRestaurantData.locationName,
                                      },
                                    });
                                    if (location) {
                                      let restaurant = await Restaurant.findOne(
                                        {
                                          where: {
                                            name: locationRestaurantData.name,
                                          },
                                        }
                                      );
                                      if (!restaurant) {
                                        restaurant = await Restaurant.create({
                                          name: locationRestaurantData.name,
                                          category:
                                            locationRestaurantData.category,
                                          // logoURL: locationRestaurantData.logoURL
                                        });
                                      }
                                      const locationRestaurant =
                                        await LocationRestaurant.create({
                                          locationId: location.toJSON().id,
                                          restaurantId: restaurant.toJSON().id,
                                          located:
                                            locationRestaurantData.located,
                                          floor: locationRestaurantData.floor,
                                          count: locationRestaurantData.count,
                                          level: locationRestaurantData.level,
                                          imagesURL:
                                            locationRestaurantData.imagesURL,
                                          remark: locationRestaurantData.remark,
                                        });
                                      // console.log(locationRestaurant.toJSON());
                                    }
                                  }
                                  //// display
                                  // const location1 = await Location.findOne({
                                  //   where: { id: 1 },
                                  //   include: [Restaurant, Door, Ramp],
                                  // });
                                  // console.log(location1?.toJSON());

                                  // const restaruant1 = await Restaurant.findOne({
                                  //   where: { id: 1 },
                                  //   include: [
                                  //     {
                                  //       model: Location,
                                  //       where: { id: 1 },
                                  //       include: [Door, Ramp],
                                  //     },
                                  //   ],
                                  // });
                                  // console.log(restaruant1?.toJSON());
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

const toBoolean = (input: string) => {
  if (input === "TURE") {
    return true;
  } else {
    return false;
  }
};
