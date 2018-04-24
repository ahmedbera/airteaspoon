const secrets = require('./secrets');
const Discord = require('discord.js');
const client = new Discord.Client();
const airteaspoon = require('./airtable');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const botID = secrets.mentions.prod;

client.on('message', message => {
  if(message.content == botID) {
    airteaspoon.getAllRemainingTasks().then((res) => {
      message.channel.send("```md\n/* TO DO */"+res+"```");
    }).catch((err) => {
      message.channel.send(err);
    })
  } else if (message.content.startsWith(botID)) {
    let params = message.content.split(" ");
    if(params[1] == "chapter") {
        let chapterNumber = params.pop();
        let seriesName = params.slice(2, params.length).join(" ");
        airteaspoon.getChapterInfo(seriesName, chapterNumber).then((res) => {
          message.channel.send("```md\n"+res+"```");
        }).catch((err) => {
          message.channel.send(err)
        })
    }
  }
});

client.login(secrets.discord);