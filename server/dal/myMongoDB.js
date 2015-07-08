var mongoClient = require('mongodb').MongoClient;
var CONNECTION_STRING = "mongodb://localhost:27017/studyB4";
var exceptions = require('../utils/exceptions');
var topics = {};
var subjectsPerLanguages = {};

module.exports.connect = function (callback) {
    mongoClient.connect(CONNECTION_STRING, function (err, db) {
        if (err) {
            var message = "Error connecting to the database";
            console.log(message);
            callback(err, message);
            return;
        }
        callback(null, new DbHelper(db));
    })
};

///Class DbHelper
function DbHelper(db) {
    this.db = db;
};

//Class Methods
DbHelper.prototype.getCollection = function (collectionName) {
    return this.db.collection(collectionName);
};

DbHelper.prototype.close = function () {
    return this.db.close();
};

module.exports.getSubjects = function (dbHelper, questionsLanguage, callback) {
    var subjects = subjectsPerLanguages[questionsLanguage];
    if (subjects) {
        callback(null, dbHelper, subjects);
    }
    else {
        var subjectsCollection = dbHelper.getCollection("Subjects");
        subjectsCollection.find({
            "questionsLanguage": questionsLanguage
        }, {}, function (err, subjectsCursor) {
            if (err || !subjectsCursor) {
                callback(new exceptions.GeneralError(500, "Error retrieving subjects for language: " + language + " from the database"));
                return;
            }
            subjectsCursor.toArray(function (err, subjects) {
                subjectsPerLanguages[questionsLanguage] = subjects;
                callback(null, dbHelper, subjects);
            })
        })
    }
};

module.exports.getTopic = function (topicId, callback) {
    var topic = topics["" + topicId];
    if (topic) {
        callback(null, topic);
    }
    else {
        this.connect(function (err, dbHelper) {
            if (err) {
                callback(err);
                return;
            }
            var topicsCollection = dbHelper.getCollection("Topics");
            topicsCollection.findOne({
                "topicId": topicId
            }, {}, function (err, topic) {
                if (err || !topic) {
                    callback(new exceptions.GeneralError(500, "Error retrieving topic Id " + topicId + " from the database"));
                    return;
                }
                topics["" + topicId] = topic;
                dbHelper.close();
                callback(null, topic);

            })
        })
    }
};
