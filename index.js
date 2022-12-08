const { Client, Events, GatewayIntentBits, User } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const CronJob = require('cron').CronJob;

const fileSystem = require('fs');

var channel;

const members = [
    { name: "Elwin", discordUserId: "141333341659070465" },
    { name: "Arren", discordUserId: "144869597344956416" },
    { name: "Dieter", discordUserId: "1049621416007454720" },
    { name: "Tim", discordUserId: "496371517568057355" }
]

client.once(Events.ClientReady, (c) => {
    console.log(`Discord client loaded, logged in as ${c.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {

    channel = client.channels.cache.get("1049616661503807560");

    // see https://crontab.guru/
    const everyDayAt11am = "0 11 * * *";
    const everyTuesdayAt10am = "0 10 * * TUE";
    const everyFirstDayOfMonth = "0 10 1 * *";
    const everyWednesdayAt10am = "0 10 * * WED";

    var keukenJobs = new CronJob(everyDayAt11am, distributeKeukenTaken(), null, false, 'Europe/Brussels');
    keukenJobs.start();
    
    var HanddoekenJob = new CronJob(everyTuesdayAt10am, distributeHanddoekenTaak(), null, false, 'Europe/Brussels');
    HanddoekenJob.start();
    
    var glasJob = new CronJob(everyFirstDayOfMonth, distributeGlas(), null, false, 'Europe/Brussels');
    glasJob.start();
    
    var gftJob = new CronJob(everyWednesdayAt10am, distributeGft(), null, false, 'Europe/Brussels');
    gftJob.start();

    // var testJob = new CronJob("46 10 * * *", async function() {
    //     var indexAfwasser = parseInt(fileSystem.readFileSync('./indexes/afwasser.txt'));
    //     await channel.send({ content: `index: ${indexAfwasser}` });
    //     indexAfwasser++;
    //     if (indexAfwasser >= members.length) {
    //         indexAfwasser = 0;
    //     }
    //     fileSystem.writeFileSync('./indexes/afwasser.txt', indexAfwasser.toString());

    // }, null, false, 'Europe/Brussels');
    // testJob.start();
})

async function distributeKeukenTaken() {

    console.log("distributeKeukenTaken() has started");

    var indexAfwasser = parseInt(fileSystem.readFileSync('./indexes/afwasser.txt'));
    var indexSousChef = parseInt(fileSystem.readFileSync('./indexes/souschef.txt'));

    if (members[indexAfwasser].name == "Arren") {
        indexAfwasser++;
    }

    if (members[indexSousChef].name == "Arren") {
        indexSousChef++;
    }

    console.log("distributeKeukenTaken() is about to get users");

    var afwasser = await getUser(indexAfwasser);
    var sousChef = await getUser(indexSousChef);

    console.log("distributeKeukenTaken() is about to send to channel");

    await channel.send({ content: `${afwasser} moet vandaag afwassen, en ${sousChef} moet Arren helpen met koken.` });

    indexAfwasser++;
    indexSousChef++;

    if (indexAfwasser >= members.length) {
        indexAfwasser = 0;
    }

    if (indexSousChef >= members.length) {
        indexSousChef = 0;
    }

    fileSystem.writeFileSync('./indexes/afwasser.txt', indexAfwasser.toString());
    fileSystem.writeFileSync('./indexes/souschef.txt', indexSousChef.toString());
}

async function distributeHanddoekenTaak() {
    var indexHanddoeken = parseInt(fileSystem.readFileSync('./indexes/handdoeken.txt'));
    var wasMadam = await getUser(indexHanddoeken);

    await channel.send({ content: `${wasMadam} moet deze week de handdoeken wassen en ophangen.` });

    indexHanddoeken++;

    if (indexHanddoeken >= members.length) {
        indexHanddoeken = 0;
    }

    fileSystem.writeFileSync('./indexes/handdoeken.txt', indexHanddoeken.toString());
}

async function distributeGlas() {
    var indexGlas = parseInt(fileSystem.readFileSync('./indexes/glas.txt'));
    var glasUser = await getUser(indexGlas);

    await channel.send({ content: `${glasUser} moet deze maand het glas wegdoen.` });

    indexGlas++;

    if (indexGlas >= members.length) {
        indexGlas = 0;
    }

    fileSystem.writeFileSync('./indexes/glas.txt', indexGlas.toString());
}

async function distributeGft() {
    var indexGft = parseInt(fileSystem.readFileSync('./indexes/gft.txt'));
    var gftUser = await getUser(indexGft);

    await channel.send({ content: `${gftUser} moet deze week het gft afval wegdoen.` });

    indexGft++;

    if (indexGft >= members.length) {
        indexGft = 0;
    }

    fileSystem.writeFileSync('./indexes/gft.txt', indexGft.toString());
}

async function getUser(index) {
    return await client.users.fetch(members[index].discordUserId);
}