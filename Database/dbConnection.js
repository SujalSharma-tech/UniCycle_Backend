import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "UniCycle-app",
    })
    .then(() => {
      console.log("DB Connected!");
    })
    .catch((err) => {
      console.log(`Some Error Occurred While Connecting to DB ${err}`);
    });
};
