require("dotenv").config();

const Eris = require("eris")
const { readdirSync } = require("fs")
const plays = require('play-dl')
const { Interaction } = require("eris")

const CONFIG = process.env

const client = new Eris.CommandClient(
  CONFIG.DISCORD_TOKEN,
  {
    intents :['all'],
    restMode: true },
    {prefix : "!"}
  );
const CommandFile = readdirSync("./commands").filter(File => File.endsWith(".js"))

CommandFile.forEach(file => {
  const command = require(`./commands/${file}`)
  client.registerCommand(command.name, async (message, args) => command.run(client, message, args), {
    aliases: command.alias,
    description: command.description
  })
})

client.on('ready', () => console.log('ready'))

client.connect();