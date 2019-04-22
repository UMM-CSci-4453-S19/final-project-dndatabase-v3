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
}

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

    switch(page)
    {
        // Main Page?
        case 1:
            break;

        // Race Gender
        case 2:
            break;

        // Class Subclass
        case 3:
            break;

        // Ability Scores (Stats)
        case 4:
            break;

        // Class Skills (Dependent on Class)
        case 5:
            break;

        // Feats (Dependent on Race)
        case 6:
            break;

        // Proficiencies
        case 7:
            break;

        // Equipment
        case 8:
            break;

        // Characteristics
        case 9:
            break;

        // Personality
        case 10:
            break;
    }

});