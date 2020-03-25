import { Client } from "discord.js";
import moment from "moment";
import yargs from "yargs-parser";
import { makemonth, pad } from "./helpers";
import Birthday from "./db/models/Birthday";

const ROLE_FORMAT = "MMDD";
const OUTPUT_FORMAT = "MMMM Do";

export default class BirthDayBot {
  constructor(token) {
    this.token = token;
    this.client = new Client();
    this.init();
  }
  async findBirthDays({ rGuild }) {
    const guild = rGuild.id;
    const birthday = moment(new Date(), ROLE_FORMAT)
      .format(ROLE_FORMAT)
      .toString();
    const body = { guild, birthday };
    const birthdays = await Birthday.find(body);
    return birthdays;
  }
  async birthDayInterval() {
    for (let i of this.client.guilds.cache) {
      const rGuild = i[1];
      if (rGuild) {
        const birthdays = await this.findBirthDays({ rGuild });
        let channel = rGuild.channels.cache.find(e => e.name === "birthdays");
        if (channel) {
          birthdays.forEach(singleBirthday => {
            const birthday = rGuild.members.cache.findKey(
              e => e.user.id == singleBirthday.member
            );
            channel.send(
              `It's <@${birthday}> birthday today! Wish him a happy birthday!`
            );
          });
        }
      }
    }
  }
  async ready(message) {
    console.log("Logged in");
    this.birthDayInterval();
    this.interval = setInterval(this.birthDayInterval.bind(this), 86400000);
  }
  async parseBody(message) {
    const { add, remove, month, day, year, person, setup } = yargs(
      message.content
    );
    const mentions = person ? person.match(/^<@!?(\d+)>$/)[1] : null;
    const { channel } = message;
    const member = mentions ? mentions : userId;
    const { id: userId } = message.member.user;
    const { id: guild } = message.guild;
    if (add) {
      try {
        const dateString = `${makemonth(month)}${pad(day, 2)}`;
        const birthday = moment(dateString, ROLE_FORMAT)
          .format(ROLE_FORMAT)
          .toString()
          .trim();
        console.log(mentions);
        const body = { member, guild, birthday };
        let birthdayBase = await Birthday.findOne({ member, guild });
        if (!birthdayBase) {
          birthdayBase = await new Birthday(body).save();
        } else {
          await birthdayBase.updateOne(body);
        }
        channel.send(`The birthday for <@${member}> has been added!`);
      } catch (e) {
        channel.send(
          `There was an error making that birthday for <@${member}>`
        );
      }
      return;
    }
    if (remove) {
      try {
        const result = await Birthday.deleteOne({ guild, member });
        if (result) {
          channel.send(`The birthday for <@${member}> is deleted!`);
        }
      } catch (e) {
        channel.send(`The birthday for <@${member}> could not be deleted!`);
      }
      return;
    }
    if (setup) {
      message.guild.channels
        .create("birthdays", {
          reason: "Needed a channel for all the new birthdaysss"
        })
        .then(() => channel.send("SETUP HAS BEEN ACHIEVED"))
        .catch(console.error);
    }
  }
  message(message) {
    if (message.content.includes("!birthday")) {
      this.parseBody(message);
    }
  }
  init() {
    this.client.on("ready", this.ready.bind(this));
    this.client.on("message", this.parseBody.bind(this));
    this.client.on("disconnect", () => clearInterval(this.interval));
    this.client.login(this.token);
  }
}
