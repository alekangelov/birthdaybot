import dotenv from "dotenv";
import BirthDayBot from "./BirthdayBot";
import x from "./db";

dotenv.config();

x().then(() => {
  new BirthDayBot(process.env.TOKEN);
});
