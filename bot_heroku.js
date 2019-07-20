var Botkit = require('botkit');
var express = require('express');
const https = require('https');
var fs = require('fs')
var path = require('path')
const { exec } = require('child_process');
var cron = require("node-cron");
var request = require("request");
const pptrFirefox = require('puppeteer');

cron.schedule('*/20 * * * *', async () => {
    console.log('pingando....')
    var browser, page;
    browser = await pptrFirefox.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], ignoreHTTPSErrors: true, waitUntil: ['load', 'domcontentloaded'] });
    page = await browser.newPage();
    // await page.goto("https://ism-grafana.herokuapp.com");
    await page.goto("https://ismmetrics.herokuapp.com/");
    browser.close();
}, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });


// Configure your bot.
var slackController = Botkit.slackbot({ clientSigningSecret: process.env.GRAFANA_SLACK_SIGNING_SECRET });
var slackBot = slackController.spawn({
    token: process.env.GRAFANA_SLACK_TOKEN
});

cron.schedule('0 21,6,14 01,02,03,04,05,06,07,20,21,22,23,24,25,26,27,28,29,30 * *', async () => {
    console.log('processing...');
    slackBot.say({
        text: "Gerdau Reports " + new Date().toDateString() + " " + new Date().toTimeString(),
        channel: 'GC0CCAJFM'
    }, (err, any) => {
        slackBot.replyInThread(any, ':waitingmaas: Give me some time to get all the information from Grafana :construction-2:', (err, res) => {
            exec('node server.js', (err, stdout, stderr) => {
                console.log(stderr);
                console.log(stdout);
                uploadTheFiles(slackBot, res.channel, res.message.thread_ts, res, ["ge4Dashboard/ge4-dashboard.png",
                    "ge4MonthEnd/ge4Month-Infra.png",
                    "ge4MonthEnd/ge4Month-Checklist.png",
                    "ge4MonthEnd/ge4Month-Oracle.png",
                    "ge4MonthEnd/ge4Month-HanaHa4.png",
                    "ge4MonthEnd/ge4MonthEnd-stoBrSoftlayerConnectivity.png",
                    "ge4MonthEnd/ge4Month-HortoCoreSwitch.png",
                    "ge4DailyMajor/ge4DailyMajor-pn4.png",
                    "ge4DailyMajor/ge4DailyMajor-nf4.png",
                    "ge4DailyMajor/ge4DailyMajor-ge4.png",
                    "ge4DailyMajor/ge4DailyMajor-hana_ha4.png",
                    "ge4UnixServerDetails/ge4UnixServerDetails-diskio.png",
                    "ge4UnixServerDetails/ge4UnixServerDetails-filesystem.png",
                    "ge4UnixServerDetails/ge4UnixServerDetails-utilization.png",
                    "ge4NetworkStatus/ge4NetworkStatus-tunnelstatus.png",
                    "ge4NetworkStatus/ge4NetworkStatus-fromIBMCloudSAO01.png",
                    "ge4NetworkStatus/ge4NetworkStatus-fromIBMCloudWDC04.png",
                    "ge4NetworkStatus/ge4NetworkStatus-hortorouters.png",
                    "ge4NetworkStatus/ge4NetworkStatus-twslatency.png",
                    "ge4NetworkStatus/ge4NetworkStatus-tsmlatency.png"
                ])
            })
        })
    });
}, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    })


async function uploadTheFiles(bot, channel, thread_ts, message, images) {
    var i = 0;
    while (i < images.length) {
        bot.api.files.upload({
            file: fs.createReadStream(images[i]),
            filename: images[i],
            filetype: "png",
            channels: channel,
            thread_ts: thread_ts,
        }, function (err, res) {
            if (err) {
                console.log("Failed to add file :(", err)
                bot.reply(message, 'Sorry, there has been an error: ' + err)
            }
        })
        i++;
    }
}

slackController.hears(['.*'], ['direct_message', 'direct_mention', 'other_event', 'file_shared'], function (bot, message) {
    slackController.log('Slack message received');
    // console.log('message', message);
    // bot.reply(message, "I'm here :) :hello-bear:");
    if (message.text == "hello") {
        bot.replyInThread(message, 'Olá! estou aqui')
    }
});

// async function uploadTheFiles(bot, message, images) {
//     var i = 0;
//     while (i < images.length) {
//         bot.api.files.upload({
//             file: fs.createReadStream(images[i]),
//             filename: images[i],
//             filetype: "png",
//             channels: message.channel,
//             thread_ts: message.thread_ts
//         }, function (err, res) {
//             if (err) {
//                 console.log("Failed to add file :(", err)
//                 bot.reply(message, 'Sorry, there has been an error: ' + err)
//             }
//         })
//         i++;
//     }
// }
// slackController.on('file_shared', function (bot, message) {

//     bot.api.files.info({ file: message.file_id }, (err, response) => {
//         // console.log(response.file.title)
//         console.log(response.file.filetype)
//         if (response.file.title == "config_criar_planilha") {
//             const file = fs.createWriteStream(path.join(__dirname, "config_criar_planilha"));
//             console.log(path.join(__dirname, "config_criar_planilha"))
//             https.get(response.file.url_private_download, {
//                 headers: {
//                     'Authorization': 'Bearer ' + process.env.SLACK_TOKEN
//                 }
//             }, function (response) {
//                 response.pipe(file);
//                 console.log(fs.existsSync(path.join(__dirname, "config_criar_planilha")))
//             });
//             bot.say({
//                 text: "Config file for 'Criar planilha' Received! :fbhappy:",
//                 channel: message.channel_id // channel Id for #slack_integration
//             });
//         } else if (response.file.title == "config") {
//             const file = fs.createWriteStream(path.join(__dirname, "config"));
//             https.get(response.file.url_private_download, {
//                 headers: {
//                     'Authorization': 'Bearer ' + process.env.SLACK_TOKEN
//                 }
//             }, function (response) {
//                 response.pipe(file);
//             });
//             bot.say({
//                 text: "Config file for all the scripts Received! :fbhappy:",
//                 channel: message.channel_id // channel Id for #slack_integration
//             });
//         } else if (response.file.filetype == "csv") {
//             if (response.file.title.includes("metrics_")) {
//                 var output_filename = response.file.title;
//                 output_filename = output_filename.split(".")[0];
//                 output_filename = output_filename.split("metrics_");
//                 output_filename = output_filename[1].toString().trim().split("-")
//                 output_filename = output_filename[2] + "-" + output_filename[1] + "-" + output_filename[0]
//                 output_filename = "Metricas_" + output_filename + ".xlsx"
//                 const file = fs.createWriteStream(path.join(__dirname, "a.csv"))
//                 https.get(response.file.url_private_download, {
//                     headers: {
//                         'Authorization': 'Bearer ' + process.env.SLACK_TOKEN
//                     }
//                 }, function (response) {
//                     response.pipe(file);
//                     build(bot, message, output_filename);
//                 });
//                 bot.say({
//                     text: "Received! :fbhappy: \nProcessing file and collecting metrics... :construction-2:",
//                     channel: message.channel_id // channel Id for #slack_integration
//                 });
//             } else {
//                 bot.say({
//                     text: "Invalid file name :sad1: ",
//                     channel: message.channel_id // channel Id for #slack_integration
//                 });
//             }

//         }

//     })
// });

slackBot.startRTM();

// function build(bot, message, output_filename) {
//     // exec('node criar_planilha.js', (err, stdout, stderr) => {
//     //     console.log('aaa');
//     //     console.log(stderr);
//     //     console.log(stdout);
//     //     exec('ls -la', (err, stdout, stderr) => {
//     //         console.log('lista de arquivos')
//     //         console.log(stdout)
//     //     })

//     // })
//     // console.log(message.channel)
//     // cmd.exe /c executar_todos.bat
//     exec('make build', (err, stdout, stderr) => {
//         console.log(stdout)
//         fs.readFile("config", { encoding: 'utf-8' }, function (err, data) {
//             var file_name = data.split('\n')[2].replace("OUTPUT_FILE=", "")
//             if (fs.existsSync(path.join(__dirname, file_name))) {
//                 bot.say({
//                     text: "Finished, uploading the file...",
//                     channel: message.channel_id // channel Id for #slack_integration
//                 });
//                 bot.api.files.upload({
//                     file: fs.createReadStream(path.join(__dirname, file_name)),
//                     filename: output_filename,
//                     filetype: "xlsx",
//                     channels: message.channel_id,

//                 }, function (err, res) {
//                     if (err) {
//                         console.log("Failed to add file :(", err)
//                         bot.reply(message, 'Sorry, there has been an error: ' + err)
//                     }
//                 })
//             } else {
//                 console.log('file dont exists', path.join(__dirname, file_name))
//             }
//         });


//     });

// }

// // Create an Express app
var app = express();
var port = process.env.PORT || 5000;
app.set('port', port);
app.get('/', (req, res) => {
    res.send('working')
})
app.listen(port, function () {
    console.log('Client server listening on port ' + port);
});
