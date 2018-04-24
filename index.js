const secrets = require('./secrets');
const Discord = require('discord.js');
const client = new Discord.Client();
const airteaspoon = require('./airtable');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if(message.content.startsWith("<@383906086551552001>")) {
    airteaspoon.getAllRemainingTasks().then((embed) => {
      message.channel.send("```md\n"+embed+"```");
    }).catch((err) => {
      message.channel.send(err);
    })
  }
});

client.login(secrets.discord);