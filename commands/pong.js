module.exports = {
    name: "pong",
    description: "Returns pang upon pong",
    alias: [],
    run: async (client, message, args) => {
        client.createMessage(message.channel.id, "!pang");
    }
  }