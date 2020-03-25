import { connect } from "mongoose";

const x = async () => {
  try {
    const y = await connect("mongodb://localhost:27017/birthdaybot", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Server Connectected to db");
  } catch (e) {
    console.error("Server hasn't connected to db!");
  }
};

export default x;
