const { Client, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const token = require('./config.json');

const CronJob = require('cron').CronJob;

var channel;

var indexAfwasser = 0;
var indexSousChef = 1;
var indexHanddoeken = 1;
var indexGlas = 2;
var indexGft = 3;

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

    if (indexAfwasser > members.length) {
        indexAfwasser = 0;
    }

    if (indexSousChef > members.length) {
        indexSousChef = 0;
    }
}

async function distributeHanddoekenTaak() {
    var wasMadam = await getUser(indexHanddoeken);

    channel.send({ content: `${wasMadam} moet deze week de handdoeken wassen en ophangen.` });

    indexHanddoeken++;

    if (indexHanddoeken > members.length) {
        indexHanddoeken = 0;
    }
}

async function distributeGlas() {
    var glasUser = await getUser(indexGlas);

    channel.send({ content: `${glasUser} moet deze maand het glas wegdoen.` });

    indexGlas++;

    if (indexGlas > members.length) {
        indexGlas = 0;
    }
}

async function distributeGft() {
    var gftUser = await getUser(indexGft);

    channel.send({ content: `${gftUser} moet deze week het gft afval wegdoen.` });

    indexGft++;

    if (indexGft > members.length) {
        indexGft = 0;
    }
}

async function getUser(index) {
    return await client.users.fetch(members[index].discordUserId);
}