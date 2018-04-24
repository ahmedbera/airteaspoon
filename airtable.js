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
    getAllRemainingTasks: getAllRemainingTasks
}