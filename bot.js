const Discord = require('discord.js');
const client = new Discord.Client();
const https = require('https');
const prefix = '!';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if (message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "wikirace") {
    https.get('https://fr.wikipedia.org/w/api.php?action=query&format=json&generator=random&grnnamespace=0&grnlimit=2&prop=info&inprop=url', (resp) => {
      let data = '';

      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      resp.on('end', () => {
        let pages = JSON.parse(data).query.pages;
        for (const pageId in pages) {//For each page in the pages received
          message.channel.send(pages[pageId].fullurl);
        }
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }
});

client.login(require('./token.json'));
