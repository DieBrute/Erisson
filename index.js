const { Interaction } = require("eris");
const Eris = require("eris");
const CONFIG = require('./config.json');
const client = new Eris.CommandClient(CONFIG.DiscordToken, {intents :['all'], restMode: true }, {prefix : "!"});
const { readdirSync } = require("fs")

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