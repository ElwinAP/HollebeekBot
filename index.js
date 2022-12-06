const { Client, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const token = require('./config.json');

const CronJob = require('cron').CronJob;

const fileSystem = require('fs');

var channel;

var indexAfwasser = parseInt(fileSystem.readFileSync('./indexes/afwasser.txt'));
var indexSousChef = parseInt(fileSystem.readFileSync('./indexes/souschef.txt'));
var indexHanddoeken = parseInt(fileSystem.readFileSync('./indexes/handdoeken.txt'));
var indexGlas = parseInt(fileSystem.readFileSync('./indexes/glas.txt'));
var indexGft = parseInt(fileSystem.readFileSync('./indexes/gft.txt'));

const members = [
    { name: "Elwin", discordUserId: "141333341659070465" },
    { name: "Arren", discordUserId: "144869597344956416" },
    { name: "Dieter", discordUserId: "1049621416007454720" },
    { name: "Tim", discordUserId: "496371517568057355" }
]

client.once(Events.ClientReady, (c) => {
    console.log(`Discord client loaded, logged in as ${c.user.tag}`);
});

client.login("MTA0OTY1NDIxMjE1MTIyNjQxOA.GuHM27.2Y6Ags1rbBbx_COIQLt8DZOucpf3sEsvKOjm0g");

client.on('ready', () => {

    channel = client.channels.cache.get("1049616661503807560");

    // see https://crontab.guru/
    const everyDayAt6Pm = "0 18 * * *";
    const everyTuesdayAt2pm = "0 14 * * TUE";
    const everyFirstDayOfMonth = "0 0 1 * *";
    const everyWednesdayAt7Pm = "0 19 * * WED";

    var keukenJobs = new CronJob(everyDayAt6Pm, distributeKeukenTaken(), null, false, 'Europe/Brussels');
    keukenJobs.start();
    
    var HanddoekenJob = new CronJob(everyTuesdayAt2pm, distributeHanddoekenTaak(), null, false, 'Europe/Brussels');
    HanddoekenJob.start();
    
    var glasJob = new CronJob(everyFirstDayOfMonth, distributeGlas(), null, false, 'Europe/Brussels');
    glasJob.start();
    
    var gftJob = new CronJob(everyWednesdayAt7Pm, distributeGft(), null, false, 'Europe/Brussels');
    gftJob.start();
})

async function distributeKeukenTaken() {

    if (members[indexAfwasser].name == "Arren") {
        indexAfwasser++;
    }

    if (members[indexSousChef].name == "Arren") {
        indexSousChef++;
    }

    var afwasser = await getUser(indexAfwasser);
    var sousChef = await getUser(indexSousChef);

    channel.send({ content: `${afwasser} moet vandaag afwassen, en ${sousChef} moet Arren helpen met koken.` });

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
    var wasMadam = await getUser(indexHanddoeken);

    channel.send({ content: `${wasMadam} moet deze week de handdoeken wassen en ophangen.` });

    indexHanddoeken++;

    if (indexHanddoeken >= members.length) {
        indexHanddoeken = 0;
    }

    fileSystem.writeFileSync('./indexes/handdoeken.txt', indexHanddoeken.toString());
}

async function distributeGlas() {
    var glasUser = await getUser(indexGlas);

    channel.send({ content: `${glasUser} moet deze maand het glas wegdoen.` });

    indexGlas++;

    if (indexGlas >= members.length) {
        indexGlas = 0;
    }

    fileSystem.writeFileSync('./indexes/glas.txt', indexGlas.toString());
}

async function distributeGft() {
    var gftUser = await getUser(indexGft);

    channel.send({ content: `${gftUser} moet deze week het gft afval wegdoen.` });

    indexGft++;

    if (indexGft >= members.length) {
        indexGft = 0;
    }

    fileSystem.writeFileSync('./indexes/gft.txt', indexGft.toString());
}

async function getUser(index) {
    return await client.users.fetch(members[index].discordUserId);
}