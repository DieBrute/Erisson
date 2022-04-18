require("dotenv").config();

const { Interaction } = require("eris");
const Eris = require("eris");
const CONFIG = process.env
const client = new Eris.CommandClient(CONFIG.DISCORD_TOKEN, {intents :['all'], restMode: true }, {prefix : "!"});
const { readdirSync } = require("fs")

const log4js = require("log4js")
let logger = log4js.getLogger("bot")
logger.level = CONFIG.LOG_LEVEL

logger.info("Starting bot ...")
const CommandFile = readdirSync("./commands").filter(File => File.endsWith(".js"))
logger.debug("Command files loaded:")


CommandFile.forEach(file => {
  const command = require(`./commands/${file}`)
  client.registerCommand(
    command.name,
    async (message, args) => {
      // dont response to a bot user
      if (!message.member.user.bot) {
        let log_msg = "Command: \"" + message.content + "\""
        try {
            await command.run(client, message, args)
            logger.info(log_msg + " - OK")
        }
        catch (err) {
            client.disconnect()
            logger.error(log_msg + " - FAIL")
            logger.error(err);
        } 
      }
    },
    {
        aliases: command.alias,
        description: command.description
    }
  )
  logger.debug(`loaded "${command.name}" command from "./commands/${file}"`)
})

client.on('ready', () => logger.info("Bot fully loaded"))
client.connect();
