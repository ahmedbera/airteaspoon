const secrets = require('./secrets');
var Airtable = require('airtable');

// "Chapters" base
var base = new Airtable({
    apiKey: secrets.airtable.apiKey
}).base(secrets.airtable.chapters);

var getAllRemainingTasks = function () {
    return new Promise((resolve, reject) => {
        let value = ""
        base('Chapters').select({
            view: "Grid view",
            filterByFormula: 'Released = 0',
        }).eachPage(function (records, fetchNextPage) {
            records.forEach(function (record) {
                if(record.get("Series Name") == undefined)
                    return
                value += "\n# " + record.get('Series Name') + " Ch." + record.get('Ch') + "\n"
                if(record.get('Tracking Progress') != undefined) {
                    value += "*  " + record.get('Tracking Progress').toString().split(',').join(', ') + "\n"
                }
                if(record.get("Comment") != undefined) {
                    value += "<Notes: " + record.get("Comment").toString().trim() + ">\n"
                }
            });
            fetchNextPage();
        }, function done(err) {
            if (err) {
                console.log(err);
                reject("An error occured :NotLikeDuck: Call jules in panic");
            }
            resolve(value);
        });
    })
}

var getChapterInfo = function(series, chapter) {
    let _series = series.toLowerCase()
    if(alias[_series]) {
        series = alias[_series]
    }
    let response = "";
    return new Promise((resolve,reject) => {
        base('Chapters').select({
            view: "Grid view",
            filterByFormula: `AND(Ch = "${chapter}" , {Series Name} = "${series}")`
        }).eachPage((records, fetchNextPage) => {
            records.forEach((record) => {
                response += "# " + record.get("Series Name") + "\n";
                response += "  [Ch. " + record.get("Ch") + "]";
                response += record.get("Vol") != undefined ? "[Vol. " + record.get("Vol") + "]\n" : "\n";
                response += "  " + record.get("Chapter name") + "\n";

                let rawCredits = record.get("CreditsForJules");
                let roleArray = rawCredits.split("|")
                roleArray.forEach((e) => {
                    var role = e.split(":")[0]
                    var slave = e.split(":")[1]
                    if(slave) { response += "<" + role + ": " + slave + ">\n" }
                });
                if(record.get("Comment") != undefined) {
                    response += `\n/* TO DO: ${record.get("Tracking Progress").toString().split(',').join(', ')} */`
                }
                if(record.get("Comment") != undefined) {
                    response += `\nNotes: ${record.get("Comment")}`
                }
            });
            fetchNextPage();
        }, function done(err) {
            if(err) {
                console.log(err);
                reject();
            }
            if(response == "") {
                reject("Couldn't find chapter information");
            }
            resolve(response);
        });
    });
}

const alias = {
    "hori" : "Hori",
    "horimiya" : "Hori",
    "nnw" : "NNW",
    "north" : "NNW",
    "taka" : "Takagi",
    "takagi" : "Takagi",
    "wota": "Wotakoi",
    "wotakoi" : "Wotakoi",
    "horus" : "Horus",
    "central" : "Central",
    "asian cooking" : "Central"
}

var getTeaspoonName = function (id) {
    return new Promise((resolve, reject) => {
        base('Teaspoons').find(id, function (err, record) {
            if (err) {
                console.error(err);
                reject;
            }
            resolve(record.get("Name"));
        });
    })
}

module.exports = Airtablespoon = {
    getAllRemainingTasks: getAllRemainingTasks,
    getChapterInfo : getChapterInfo
}