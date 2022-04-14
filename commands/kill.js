module.exports = {
    name: "kill",
    description: "kills the bot",
    alias: [],
    run: async (client, message, args) => {
        client.disconnect();
    }
}