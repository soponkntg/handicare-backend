import S3, { ManagedUpload } from "aws-sdk/clients/s3";
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
  LocationImage,
} from "../models/index";
import dotenv from "dotenv";
dotenv.config();

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
        contact: row["Contact"],
        imageURL: row["Image URL"],
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
            doorType: row["Door Type"],
            located: row["Located"],
            floor: row["Floor"],
            contact: row["Contact"],
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
                                          contact:
                                            locationRestaurantData.contact,
                                          count: locationRestaurantData.count,
                                          level: mapLevel(
                                            locationRestaurantData.level
                                          ),
                                          doorType:
                                            locationRestaurantData.doorType,
                                          imagesURL:
                                            locationRestaurantData.imagesURL,
                                          remark: locationRestaurantData.remark,
                                        });
                                      // console.log(locationRestaurant.toJSON());
                                    }
                                  }
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

const mapLevel = (input: number) => {
  if (0) return "Accessible routes";
  if (1) return "Slightly steep";
  if (2) return "Require assistance";
};

const toBoolean = (input: string) => {
  if (input === "TRUE") {
    return true;
  } else {
    return false;
  }
};

export const storeImage = async () => {
  const bucketName = process.env.AWS_BUCKET_NAME || "";
  const region = process.env.AWS_BUCKET_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SECRET_KEY;
  const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
  });

  const imageFolders = [
    "Crystal Design Center (CDC)",
    "The Commons Thonglor",
    "J Avenue",
    "Market Place Thonglor",
    "Suanplern Market",
  ];
  for (let folders of imageFolders) {
    const directoryPath = path.join(__dirname, `collection/images/${folders}`);
    console.log(directoryPath);
    let index = 1;
    //passsing directoryPath and callback function
    const imagesURL = [];
    const l = await Location.findOne({ where: { name: folders } });
    const location = l?.toJSON();
    fs.readdir(directoryPath, async (err, files) => {
      //handling error
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }
      //listing all files using forEach
      for (let file of files) {
        // Do whatever you want to do with the file
        const imageDirectoryPath = path.join(
          __dirname,
          `collection/images/${folders}/${file}`
        );
        if (imageDirectoryPath.includes(".DS_Store")) {
          continue;
        }
        console.log(imageDirectoryPath);

        const fileStream = fs.createReadStream(imageDirectoryPath);
        const result = await s3
          .upload({
            Bucket: bucketName,
            Body: fileStream,
            Key: `${folders.toLowerCase().replace(" ", "-") + index++}.jpg`,
            ContentType: "image/jpeg",
          })
          .promise();
        await LocationImage.create({
          imageURL: result.Location,
          locationId: location.id,
        });
      }
    });
  }
};
