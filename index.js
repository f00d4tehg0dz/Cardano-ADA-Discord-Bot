// fs is Node's native file system modul
const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');

// add config and prefix
const {
	prefix,
	token,
} = require('./config.json');
// create a new Discord client
const client = new Discord.Client();
// This next step is how you'll dynamically retrieve all your newly created command files. Add this below your client.commands line:
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// The fs.readdirSync() method will return an array of all the file names in that directory, e.g. ['ping.js', 'beep.js']. The filter is there to make sure any non-JS files are left out of the array. With that array, you can loop over it and dynamically set your commands to the Collection you made above.
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);

}

const cooldowns = new Discord.Collection();
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	// client.user.setActivity('Randomizing');
	client.user.setActivity('Checking Price');
	console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
	// console.log('Ready!');
});

// Listening for messages
client.on('message', message => {
	// If the message either doesn't start with the prefix or was sent by a bot, exit early.
	// Create an args variable that slices off the prefix entirely and then splits it into an array by spaces.
	//    create a command variable by calling args.shift(), which will take the first element in array and return it while also removing it from the original array (so that you don't have the command name string inside the args array).
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

// login to Discord with your app's token
// with out prefix client.login(config.token)
// with prefix:
client.login(token);
