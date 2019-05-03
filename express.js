mysql = require('mysql'),
    dbf = require('./gamemaster.dbf-setup.js');

var express=require('express'),
    app = express(),
    port = process.env.PORT || 1337;

app.use(express.static(__dirname + '/public'));
app.listen(port);

var DoQuery = function(sql)
{
    return dbf.query(mysql.format(sql));
};

app.get("/login", function(req, res)
{
    var uname = req.param('uname');
    var pword = req.param('pword');

    var sql = "SELECT * FROM dnd_users WHERE user = '" + uname + "' AND password = '" + pword + "';";
    var pResult = DoQuery(sql);

    var pResolve = Promise.resolve(pResult);
    pResolve.then(function(rows)
    {
        //If the result is not null we found a valid login
        if(!rows[0])
        {
            res.send(false);
        }
        else
        {
            res.send(true);
        }
    });
});

app.get("/meta", function(req, res)
{
    var page = req.param('page');
    console.log("The page passed /meta in express.js is " + page);

    switch(page)
    {
        // Character Selection Screen. Needs parameters: page, username
        case "1":

            // Require extra user param
            var username = req.param('opt1');

            // Construct SQL
            var sql = "SELECT characterId, name, level, race, class, subclass FROM dnd_characters WHERE userID = (SELECT id FROM dnd_users WHERE user = '" + username + "');";
            var pResult = DoQuery(sql);
            var pResolve = Promise.resolve(pResult);
            pResolve.then(function(rows)
            {
                // Returns multiple characters with a given username
                sql = "SELECT class FROM dnd_classes WHERE classId = " + rows[0].class;
                var classResult = DoQuery(sql);
                var classResolve = Promise.resolve(classResult);
                classResolve.then(function(classRows)
                {
                    console.log(JSON.stringify(rows) + JSON.stringify(classRows));
                    res.send(rows);
                })
            });

            break;

        // Race Gender
        case "2":
            break;

        // Class Subclass
        case "3":
            break;

        // Ability Scores (Stats)
        case "4":
            break;

        // Class Skills (Dependent on Class)
        case "5":
            break;

        // Feats (Dependent on Race)
        case "6":
            break;

        // Proficiencies
        case "7":
            break;

        // Equipment
        case "8":
            break;

        // Characteristics
        case "9":
            break;

        // Personality
        case "10":
            break;
    }

});