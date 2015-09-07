var mathjs = require("mathjs");

//-------------------------------------------------------------------------------
// TODO: global variables - should all go to database - with lazy cash loading
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// Supported languages
//-------------------------------------------------------------------------------
var supportedLanguages = {
    "en": {
        "value": "en",
        "direction": "ltr",
        "align": "left",
        "oppositeAlign": "right",
        "displayNames": {"en": "English", "he": "אנגלית", "es": "Inglés"}
    },
    "he": {
        "value": "he",
        "direction": "rtl",
        "triviaTopics": [5, 270],
        "align": "right",
        "oppositeAlign": "left",
        "displayNames": {"en": "Hebrew", "he": "עברית", "es": "Hebreo"}
    },
    "es": {
        "value": "es",
        "direction": "ltr",
        "triviaSubjectId": 210,
        "align": "left",
        "oppositeAlign": "right",
        "displayNames": {"en": "Spanish", "he": "ספרדית", "es": "Español"}
    }
}

//-------------------------------------------------------------------------------
// Trivia topics for each language
//-------------------------------------------------------------------------------
var triviaTopisPerLangage = {
    "en": [10],
    "he": [5, 270],
    "es": [465]
}

//-------------------------------------------------------------------------------
// generalSettings - sent back to the client
//-------------------------------------------------------------------------------
var generalSettings = {
    "languages": supportedLanguages,
    "charts": {
        "contestAnnotations": {
            "annotationsFont": "10px Arial",
            "annotationHorizontalMagicNumbers": {
                "ltr": {
                    "endsIn": {"id": 0, "position": "$chartstartx + ", "spacing": 2},
                    "participants": {"id": 1, "position": "$chartendx - ", "spacing": 0}
                },
                "rtl": {
                    "endsIn": {"id": 0, "position": "$chartendx - ", "spacing": 7},
                    "participants": {"id": 1, "position": "$chartstartx + ", "spacing": 3}
                },
            }
        },
        "chartObject": {
            "chart": {
                "bgColor": "#FFFFFF",
                "plotBorderAlpha": 0,
                "baseFont": "Arial",
                "baseFontSize": 12,
                "showBorder": 1,
                "showCanvasBorder": 0,
                "showPlotBorder": 0,
                "showCanvasBg": 0,
                "yAxisMinValue": 0.0,
                "yAxisMaxValue": 1.0,
                "numDivLines": 0,
                "adjustDiv": 0,
                "divLineColor": "#FFFFFF",
                "labelFontColor": "#040404",
                "numberScaleValue": ".01",
                "numberScaleUnit": "%",
                "showYAxisValues": 0,
                "valueFontSize": 12,
                "labelFontSize": "15",
                "chartBottomMargin": 25,
                "valuePadding": 0,
                "labelPadding": 10,
                "useRoundEdges": "1",
                "showToolTip": 0,
                "labelDisplay": "auto",
                "useEllipsesWhenOverflow": 1,
                "maxLabelWidthPercent": 50
            },
            "annotations": {
                "groups": [
                    {
                        "id": "infobar",
                        "items": [
                            {
                                "id": "label",
                                "type": "text",
                                "y": "$chartendy - 8",
                                "fontSize": 10,
                                "font": "Arial",
                                "fontColor": "#000000"
                            },
                            {
                                "id": "label",
                                "type": "text",
                                "y": "$chartendy - 8",
                                "fontSize": 10,
                                "font": "Arial",
                                "fontColor": "#000000"
                            }
                        ]
                    }
                ]
            },
        }
    },
    "contestList": {
        "pageSize": 5,
        "distance": "50%"
    }
}
module.exports.generalSettings = generalSettings;

//-------------------------------------------------------------------------------
// Features can be unlocked either by having a minimum rank or by purchasing an
// item per that feature
//-------------------------------------------------------------------------------
var unlockFeatures = {
    "newContest": {"rank": 3, purchaseProductId: "newContest"},
    "inviteFriendsToContest": {"rank": 2, purchaseProductId: "inviteFriendsToContest"}
}
module.exports.unlockFeatures = unlockFeatures;

//-------------------------------------------------------------------------------
// rankByXp steps - rank must be consecutive starting from 1
//-------------------------------------------------------------------------------
var rankByXp = [
    {"xp": 100, "rank": 1},
    {"xp": 500, "rank": 2},
    {"xp": 1500, "rank": 3},
    {"xp": 3000, "rank": 4}
]

var xpCredits = {
    "login": 5,
    "joinContest": 10,
    "playContest": 50,
    "shareContest": 30
}
module.exports.xpCredits = xpCredits;

//-------------------------------------------------------------------------------
// Private functions
//-------------------------------------------------------------------------------

//-------------------------------------------------------------------------------
// binaryRangeSearch - searches a number within a range array
//-------------------------------------------------------------------------------
function binaryRangeSearch(arr, searchProperty, number) {

    if (arr.length == 1) {
        return arr[0][resultProperty];
    }

    var first = 0;
    var last = arr.length - 1;

    var mid;
    while (first <= last) {
        mid = mathjs.floor((first + last) / 2);
        if (number < arr[mid][searchProperty]) {
            last = mid - 1;
        }
        else if (number > arr[mid][searchProperty]) {
            first = mid + 1;
        }
        else {
            break;
        }
    }
    return arr[mid];
}

//-----------------------------------------------------------------------
// getDirectionByLanguage
//
// returns the direction (ltr/rtl) based on language
//-----------------------------------------------------------------------
module.exports.getDirectionByLanguage = getDirectionByLanguage;
function getDirectionByLanguage(languageCodeIso2) {
    switch (languageCodeIso2) {
        case "he":
            return "rtl";
        default:
            return "ltr";
    }
}

//-----------------------------------------------------------------------
// getLanguageByCountryCode
//
// returns the default language based on country ISO2 code
//-----------------------------------------------------------------------
module.exports.getLanguageByCountryCode = getLanguageByCountryCode;
function getLanguageByCountryCode(countryCode) {

    switch (countryCode) {
        case "IL":
            return "he";

        case "AR":  //Argentina
        case "BO":  //Bolivia
        case "CL":  //Chile
        case "CO":  //Colombia
        case "CR":  //Costa Rica
        case "DO":  //Dominican Republic
        case "EC":  //Ecuador
        case "ES":  //Spain
        case "GT":  //Guatemala
        case "HN":  //Honduras
        case "MX":  //Mexico
        case "NI":  //Nicaragua
        case "PA":  //Panama
        case "PE":  //Peru
        case "PR":  //Puerto Rico
        case "PY":  //Paraguay
        case "SV":  //El Salvador
        case "UY":  //Uruguay
        case "VE":  //Venezuela
            return "es";

        default:
            return "en";
    }
}

//-----------------------------------------------------------------------
// geoInfo
//
// returns language based on country
//-----------------------------------------------------------------------
module.exports.geoInfo = function (req, res, next) {
    var geoInformation = req.body;
    var language = getLanguageByCountryCode(geoInformation.country_code);
    res.json({"language": language});
}

//-----------------------------------------------------------------------
// getSettings (client request)
//
// returns general server settings for each client
//-----------------------------------------------------------------------
module.exports.getSettings = function (req, res, next) {
    res.json(generalSettings);
}

//-----------------------------------------------------------------------
// getLanguageTriviaTopics
//
// returns trivia topic list for each language
//-----------------------------------------------------------------------
module.exports.getLanguageTriviaTopics = function (language) {
    return triviaTopisPerLangage[language];
};


//Object can be either a session or a user - both should contain xp and rank as properties
//-----------------------------------------------------------------------
// addXp
//
// returns a rank of a given experience
//-----------------------------------------------------------------------
module.exports.addXp = function (object, action) {

    var xp = xpCredits[action];
    if (xp) {
        object.xp += xp;
        var result = binaryRangeSearch(rankByXp, "xp", object.xp);
        object.rank = result.rank;
        return xp;
    }

    //Error - the action does not produce any xp
    return null;
};

//-----------------------------------------------------------------------------------
// getXpProgress
//
// returns the xp in a relational manner to be presented in a progress element
//-----------------------------------------------------------------------------------
module.exports.getXpProgress = function(xp, rank) {

    var xpForRank;
    if (rank-2 >= 0) {
        xpForRank = rankByXp[rank-2].xp;
    }
    else {
        xpForRank = 0;
    }

    var xpForNextRank = rankByXp[rank-1].xp;
    var xpAchievedInRank = xp - xpForRank;
    var xpDelta = xpForNextRank - xpForRank;
    return {"value" : xpAchievedInRank, "max" : xpDelta, "percent" : mathjs.floor(xpAchievedInRank * 100 / xpDelta)};
}