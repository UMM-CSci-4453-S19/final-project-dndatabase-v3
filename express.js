mysql = require('mysql'),
    dbf = require('./gamemaster.dbf-setup.js');

var express = require('express'),
    app = express(),
    port = process.env.PORT || 1337;

app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen(port);

var DoQuery = function (sql) {
    return dbf.query(mysql.format(sql));
};

app.get("/login", function (req, res) {
    var uname = req.param('uname');
    var pword = req.param('pword');
    var sql = "SELECT * FROM dnd_users WHERE user = '" + uname + "' AND password = '" + pword + "';";
    var pResult = DoQuery(sql);

    var pResolve = Promise.resolve(pResult);
    pResolve.then(function (rows) {
        //If the result is not null we found a valid login
        if (!rows[0]) {
            res.send('false');
        }
        else {
            res.send('true');
        }
    });
});

app.get("/new", function (req, res) {
    var uname = req.param('uname');
    var cname = req.param('cname');

    var sql = "INSERT INTO dnd_characters (userId, name) VALUES ( (SELECT id FROM dnd_users WHERE user = '" + uname + "' ), '" + cname + "')";
    var pResult = DoQuery(sql);
    var pResolve = Promise.resolve(pResult);

    pResolve.then(function (rows) {

        var returnsql = "SELECT * FROM dnd_characters WHERE name = '" + cname + "';";
        var qResult = DoQuery(returnsql);
        var qResolve = Promise.resolve(qResult);

        qResolve.then(function (char) {
            res.send(char);
        });
    });
});

app.get("/meta", function (req, res) {
    var page = req.param('page');
    // console.log("The page passed /meta in express.js is " + page);
    switch (page) {
        // Character Selection Screen. Needs parameters: page, username
        // Main Page?
        case "0":

            var username = req.param('opt1');

            // Construct SQL
            var leftJoinSql = "SELECT dnd_characters.characterId, dnd_characters.name, dnd_characters.level, " +
                "dnd_characters.race as raceId, dnd_races.race, dnd_characters.class as classId, dnd_classes.class, dnd_characters.subclass as subclassId, " +
                "dnd_subclasses.subclass FROM dnd_characters left join dnd_classes on dnd_characters.class = dnd_classes.classId " +
                "left join dnd_races on dnd_races.raceId = dnd_characters.race left join dnd_subclasses on " +
                "dnd_characters.subclass = dnd_subclasses.subclassId WHERE userID = " +
                "(SELECT id FROM dnd_users WHERE user = '" + username + "');";
            var pResult = DoQuery(leftJoinSql);
            var pResolve = Promise.resolve(pResult);

            pResolve.then(function (rows) {
                // console.log('are we getting the correct characters ????', rows);
                res.send(rows);
            });

            break;
        // Race
        case "1":

            var sql = "SELECT * FROM dnd_races";
            var charId = req.param('opt1');
            var pResult = DoQuery(sql);
            var pResolve = Promise.resolve(pResult);
            var charClass = req.param('opt1');
            pResolve.then(function (rows) {
                var raceSql = "SELECT race FROM dnd_characters WHERE characterId = " + charId;
                var raceResult = DoQuery(raceSql);
                var raceResolve = Promise.resolve(raceResult);
                raceResolve.then( function (raceReturn)
                {
                    res.send([rows,raceReturn]);
                });
            });
            break;

        // Class
        case "2":
            var sql = "SELECT dnd_classes.classId, dnd_classes.class, dnd_subclasses.classId, dnd_subclasses.description, " +
                "dnd_subclasses.subclass, dnd_subclasses.subclassId FROM dnd_classes left join dnd_subclasses on dnd_classes.classId = dnd_subclasses.classId;";
            var charId = req.param('opt1');
            var pResult = DoQuery(sql);
            var pResolve = Promise.resolve(pResult);
            pResolve.then(function (rows) {
                var classSql = "SELECT class, subclass FROM dnd_characters WHERE characterId = " + charId;
                var classResult = DoQuery(classSql);
                var classResolve = Promise.resolve(classResult);
                classResolve.then( function (classReturn)
                {
                    res.send([rows,classReturn]);
                });
            });
            // console.log("Got classes!");
            break;

        // Stats
        case "3":
            var sql = "SELECT * from dnd_stats;";
            var charId = req.param('opt1');
            var pResult = DoQuery(sql);
            var pResolve = Promise.resolve(pResult);
            pResolve.then(function (rows) {
                var statsSql = "SELECT strength, dexterity, constitution, charisma, intelligence, wisdom FROM dnd_stats WHERE characterId = " + charId;
                var statsResult = DoQuery(statsSql);
                var statsResolve = Promise.resolve(statsResult);
                statsResolve.then( function (statsReturn)
                {
                    res.send([rows,statsReturn]);
                });
            });
            // console.log("Got stats!");
            break;

        // Feats
        case "4":
            var sql = "SELECT * from dnd_feats;";
            var charId = req.param('opt1');
            var pResult = DoQuery(sql);
            var pResolve = Promise.resolve(pResult);
            pResolve.then(function (rows) {
                var featsSql = "SELECT feat1 FROM dnd_character_abilities WHERE characterId = " + charId;
                var featsResult = DoQuery(featsSql);
                var featsResolve = Promise.resolve(featsResult);
                featsResolve.then( function (featsReturn)
                {
                    res.send([rows,featsReturn]);
                });
            });
            // console.log("Got stats!");
            break;

        // Class Skills (Dependent on Class)
        case "5":
            var charClass = req.param('opt1');
            var subClass = req.param('opt2');
            var user = req.param('opt3');
            var charId = req.param('opt4');
            var level = req.param('opt5');
            // var maxId = parseInt(charClass) * 100 + ((parseInt(subClass) + 1) * 10);
            // var minId = parseInt(charClass) * 100 + ((parseInt(subClass)) * 10);
            var maxId = parseInt(subClass)*10+10;
            var minId = parseInt(subClass)*10;
            var allId = parseInt(charClass)*100+30;
            var sql = "select * from dnd_powers where powerID < " + maxId +
                " and powerID >= " + minId + " AND level <= " + level;
            // console.log('subclass: ', subClass);
            // console.log(sql);
            // console.log(sql);
            var pResult = DoQuery(sql);
            var pResolve = Promise.resolve(pResult);
            pResolve.then(function (rows) {
                var powers = rows;
                var charAbilitesSQL = "SELECT power1, power2 FROM dnd_character_abilities WHERE characterId = " + charId +
                    " AND userId = '" + user + "'";
                var subResult = DoQuery(charAbilitesSQL);
                var subResolve = Promise.resolve(subResult);
                subResolve.then(function (values) {
                    if (!powers[0]) {
                        powers = "{}"
                    }
                    if (!values[0]) {
                        values = "{}"
                    }

                    res.send([powers, values]);
                });
                // console.log(rows);
            });
            // console.log("Get Skills!!!!");
            break;

        // Feats (Dependent on Race)
        case "6":
            var sql = "SELECT * from dnd_proficiencies;";
            var charId = req.param('opt1');
            var pResult = DoQuery(sql);
            var pResolve = Promise.resolve(pResult);
            pResolve.then(function (rows) {
                var profSql = "SELECT prof1, prof2, prof3 FROM dnd_character_abilities WHERE characterId = " + charId;
                var profResult = DoQuery(profSql);
                var profResolve = Promise.resolve(profResult);
                profResolve.then( function (profReturn)
                {
                    res.send([rows,profReturn]);
                });
            });
            // console.log("Got stats!");
            break;

        // Proficiencies
        case "7":
            var weaponsSQL = "SELECT * FROM dnd_weapons";
            var weaponResult = DoQuery(weaponsSQL);
            var weaponResolve = Promise.resolve(weaponResult);
            var charId = req.param('opt1');
            weaponResolve.then(function(weaponResponse)
            {
                var armorSQL = "SELECT * FROM dnd_armor";
                var armorResult = DoQuery(armorSQL);
                var armorResolve = Promise.resolve(armorResult);
                armorResolve.then(function(armorResponse)
                {
                    // final response array
                    var finalResponse = [];

                    // Populate weapons into final response
                    for(var weaponKey in weaponResponse) {
                        finalResponse.push(weaponResponse[weaponKey]);
                    }

                    // Populate armors into final response
                    for( var armorKey in armorResponse){
                        finalResponse.push(armorResponse[armorKey]);
                    }

                    var inventorySql = 'Select weaponSlotOne, weaponSlotTwo, armorSlot from dnd_inventory WHERE characterId=' + charId;
                    var inventoryResult = DoQuery(inventorySql);
                    var inventoryResolved = Promise.resolve(inventoryResult);
                    inventoryResolved.then( function(charInventory) {
                        res.send([finalResponse, charInventory]);
                    });
                });
            });
            break;

        // Equipment
        case "8":
            res.send("{}");
            break;

        // Characteristics
        case "9":
            res.send("{}");
            break;

        // Personality
        case "10":

            res.send("{}");
            break;
    }

});

app.post("/character", function (req, res) {
    var message = req.param('message');
    var charId = req.param('characterId');
    var user = req.param('user');
    // console.log('request: ', req.body);
    // if (message === 'add') {
    //     console.log('add requested on server!!!');
    //     res.send('{}');
    // } else if (message === 'update') {
        console.log('____!!!!!!!!!update requested on server!!!!_____________');
    //     res.send('{}');
    // }

    // page 5 Powers
    page1submit(user, charId, req.body);
    page2submit(user, charId, req.body);
    page3submit(user, charId, req.body);
    page4submit(user, charId, req.body);
    page5submit(user, charId, req.body);
    page6submit(user, charId, req.body);
    page7submit(user, charId, req.body);


    res.send('{}');
});

///////// update/add functions per page
function page1submit(user, charId, pageArr) {
    var updateSql = "UPDATE dnd_characters SET race = " + pageArr[0].raceId + " WHERE characterId = " + charId + "";
    console.log(updateSql);
    var updateResult = DoQuery(updateSql);
    return updateResult;
    // var updateResolve = Promise.resolve(updateResult);
    // return updateResolve;
}

function page2submit(user, charId, pageArr) {

    var updateSql = "UPDATE dnd_characters SET class = " + pageArr[1].class + ", subclass = " + pageArr[1].subclass + " WHERE characterId = " + charId + "";
    console.log(updateSql);
    var updateResult = DoQuery(updateSql);
    return updateResult;
    // var updateResolve = Promise.resolve(updateResult);
    // return updateResolve;
}

function page3submit(user, charId, pageArr) {

    var sql = "SELECT * FROM dnd_stats WHERE characterId = " + charId;
    var pResult = DoQuery(sql);
    // console.log("user is: " + user, "character id is: " + charId);
    var pResolve = Promise.resolve(pResult);
    pResolve.then(function (res) {
        if (res[0]) {
            var updateSql = "UPDATE dnd_stats SET strength = " + pageArr[2].strength + ", dexterity = " + pageArr[2].dexterity +
                ", constitution = " + pageArr[2].constitution + ", charisma = " + pageArr[2].charisma + ", intelligence = " + pageArr[2].intelligence +
                ", wisdom = " + pageArr[2].wisdom + " WHERE characterId = " + charId + " AND userId = '" + user + "'";

            var updateResult = DoQuery(updateSql);
            return updateResult;
            // var updateResolve = Promise.resolve(updateResult);
            // return updateResolve;
        } else {
            var addSql = "INSERT INTO dnd_stats (userId, characterId, strength, dexterity, constitution, charisma, intelligence, wisdom) VALUES ( '" +
                user + "', " + charId + ", " + pageArr[2].strength + ", " + pageArr[2].dexterity + ", " + pageArr[2].constitution + ", " + pageArr[2].charisma +
                ", " + pageArr[2].intelligence + ", " + pageArr[2].wisdom + ")";

            var addResult = DoQuery(addSql);
            return addResult;
            // var addResolve = Promise.resolve(addResult);
            // return addResolve;
        }
    })
}

function page4submit(user, charId, pageArr) {
    var updateSql = "UPDATE dnd_character_abilities SET feat1 = " + pageArr[3].feat + " WHERE characterId = " + charId + "";
    console.log(updateSql);
    var updateResult = DoQuery(updateSql);
    return updateResult;
    // var updateResolve = Promise.resolve(updateResult);
    // return updateResolve;
}

function page5submit(user, charId, pageArr) {
    var sql = "SELECT * FROM dnd_character_abilities WHERE characterId = " + charId;
    var pResult = DoQuery(sql);
    // console.log("user is: " + user, "character id is: " + charId);
    var pResolve = Promise.resolve(pResult);
    pResolve.then(function (res) {
        if (res[0]) {
            var updateSql = "UPDATE dnd_character_abilities SET power1 = " + pageArr[4].power1 + ", power2 = " + pageArr[4].power2 +
                " WHERE characterId = " + charId + " AND userId = '" + user + "'";

            var updateResult = DoQuery(updateSql);
            return updateResult;
            // var updateResolve = Promise.resolve(updateResult);
            // return updateResolve;
        } else {
            var addSql = "INSERT INTO dnd_character_abilities (userId, characterId, power1, power2) VALUES ( '" +
                user + "', " + charId + ", " + pageArr[4].power1 + ", " + pageArr[4].power1 + ")";

            var addResult = DoQuery(addSql);
            return addResult;
            // var addResolve = Promise.resolve(addResult);
            // return addResolve;
        }
    })
}

function page6submit(user, charId, pageArr) {
    var sql = "SELECT * FROM dnd_proficiencies;";
    var pResult = DoQuery(sql);
    // console.log("user is: " + user, "character id is: " + charId);
    var pResolve = Promise.resolve(pResult);
    pResolve.then(function (res) {
        if (res[0]) {
            var updateSql = "UPDATE dnd_character_abilities SET prof1 = " + pageArr[5].prof1 + ", prof2 = " + pageArr[5].prof2 +
                ", prof3  = " + pageArr[5].prof3 + " WHERE characterId = " + charId + " AND userId = '" + user + "'";

            var updateResult = DoQuery(updateSql);
            return updateResult;
            // var updateResolve = Promise.resolve(updateResult);
            // return updateResolve;
        } else {
            var addSql = "INSERT INTO dnd_character_abilities (userId, characterId, prof1, prof2, prof3) VALUES ( '" +
                user + "', " + charId + ", " + pageArr[5].prof1 + ", " + pageArr[5].prof2 + ", " + pageArr[5].prof3 + ")";

            var addResult = DoQuery(addSql);
            return addResult;
            // var addResolve = Promise.resolve(addResult);
            // return addResolve;
        }
    })
}

function page7submit(user, charId, pageArr) {
    var sql = "SELECT * FROM dnd_inventory Where characterId = " + charId;
    var pResult = DoQuery(sql);
    var pResolve = Promise.resolve(pResult);
    pResolve.then(function (res) {
        if (res[0]) {
            var updateSql = "UPDATE dnd_inventory SET weaponSlotOne = " + pageArr[6].weapon + ", weaponSlotTwo = " + pageArr[6].weapon2 + ", armorSlot = " + pageArr[6].armor +
            " WHERE characterId = " + charId;

            var updateResult = DoQuery(updateSql);
            return updateResult;
            // var updateResolve = Promise.resolve(updateResult);
            // return updateResolve;
        } else {
            var addSql = "INSERT INTO dnd_inventory (userId, characterId, weaponSlotOne, weaponSlotTwo, armorSlot) VALUES ( '" +
                user + "', " + charId + ", " + pageArr[6].weapon + ", " + pageArr[6].weapon2 + ", " + pageArr[6].armor + ")";

            var addResult = DoQuery(addSql);
            return addResult;
        }
    })
}