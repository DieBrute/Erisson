require("dotenv").config();

const { Interaction } = require("eris");
const Eris = require("eris");
const CONFIG = process.env
const client = new Eris.CommandClient(CONFIG.DISCORD_TOKEN, {intents :['all'], restMode: true }, {prefix : "!"});
const { readdirSync } = require("fs")

const CommandFile = readdirSync("./commands").filter(File => File.endsWith(".js"))

CommandFile.forEach(file => {
  const command = require(`./commands/${file}`)
  client.registerCommand(
    command.name,
    async (message, args) => {
        try {
            await command.run(client, message, args)
        }
        catch (err) {
            client.disconnect()
            console.log(err);
        }
    },
    {
        aliases: command.alias,
        description: command.description
    }
  )
})

client.on('ready', () => console.log('ready'))

client.connect();