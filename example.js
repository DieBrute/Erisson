const { Interaction } = require("eris");
const Eris = require("eris");
const CONFIG = require('./config.json');
const client = new Eris.Client(CONFIG.DiscordToken, {intents :['all'], restMode: true });

client.on('messageCreate', async message => {
    if (message.content === '!play') {
        const id = message.channel.guild.members.get(message.author.id).voiceState.channelID;

        if (id === null) return client.createMessage(message.channel.id, 'join a voice channel');
        const channel = await client.getRESTChannel(id);
        const connection = await channel.join();

        connection.play('https://cdn.discordapp.com/attachments/931487798110859265/939558715072339998/bootleg_montero_cover.mp3');

        connection.on('end', () => { channel.leave(); });
    }
})

client.on('ready', () => console.log('ready'))

client.connect();