angular.module('characterCreator', [])
    .controller('mainCtrl', MainCtrl)
    .factory('mainApi', mainApi)
    //.factory('transactionApi', transactionApi)
    .constant('apiUrl', 'http://localhost:1337'); // CHANGED for the lab 2017!

function MainCtrl($scope, mainApi)
{
    $scope.logIn = logIn;
    $scope.logOut = logOut;
    $scope.prev = prev;
    $scope.next = next;

    $scope.logged_in = false;
    $scope.uname = '';
    $scope.pword = '';
    $scope.pageArr = [true, false, false, false, false, false, false, false, false, false];
    $scope.curPage = 0;
    $scope.serverData = [];

    $scope.loading = false;
    $scope.race = {};
    $scope.class = {};
    $scope.subClass = {};

    // page 5 skills/abilities

    $scope.power1Ctrl = '';

    // page 8 weapons as part of equipment
     $scope.weaponCtrl = '';

    var _power1Val = '';
    $scope.power1Ctrl = {
        value: function(newVal) {
            return arguments.length ? (_power1Val = newVal) : _power1Val;
        }
    };

    var weaponVal = '';
    $scope.weaponCtrl = {
        value: function(newVal) {
            return arguments.length ? (weaponVal = newVal) : weaponVal;
        }
    };

    $scope.serverData = [];

    // page 7 proficiencies
    $scope.profCtrl = '';

    var profVal = '';
    $scope.profCtrl = {
        value: function(newVal) {
            return arguments.length ? (profVal = newVal) : profVal;
        }
    };

    $scope.displayCharacters = displayCharacters;
    $scope.characters = [];

    function logIn(uname, pword)
    {
        console.log("Trying to log in with name " + uname + " and password " + pword);
        mainApi.logInUser(uname, pword).success(function (response)
        {
            $scope.logged_in = response;
            setPage(0);
        }).error(function (response)
        {
            console.log(response);
        });
    }

    function setPage(pageNum) {
        $scope.serverData = null;
        $scope.loading = true;
        console.log(pageNum);
        for (var i = 0; i < $scope.pageArr.length; i++) {
            if (i === pageNum) {
                $scope.pageArr[i] = true;
                $scope.curPage = i;
            } else {
                $scope.pageArr[i] = false;
            }
        }
        console.log($scope.pageArr);
        console.log('setting page!!!');
        mainApi.changePage($scope.curPage).success(function (serverData) {
            $scope.serverData = serverData;
            console.log('stuff from the server!!!! ' , $scope.serverData);
            $scope.loading = false;
        }).error(function (serverData)
        {
            console.log("Error while retrieving data " + serverData);
        });
    }

    // starter function to update the race class and subclass of selected character on server
    function updateRaceClass(race, charClass, subClass) {
        mainApi.changeRaceClass(race,charClass,subClass).success(function (serverData) {
            // here will be any subsequent server requests or variables changes to initiate subsequent requests
            console.log('server updated race class');
        }).error(function (serverData)
        {
            console.log("Error while retrieving data " + serverData);
        });
    }

    function logOut()
    {
        $scope.logged_in = !$scope.logged_in;
    }
    function next() {
        if ($scope.curPage < $scope.pageArr.length - 1) {
            $scope.curPage++;
            setPage($scope.curPage);
            console.log($scope.curPage);
        }
    }
    function prev() {
        if ($scope.curPage > 0) {
            $scope.curPage--;
            setPage($scope.curPage);
            console.log($scope.curPage);
        }
    }

    // This can be a generic doFunction(pageNum) function that takes in input,pageNum, from html and then we have a switch(PageNum)
    // statement after mainApi.changePage(pageNum).success.... to see which value should store the response
    // or we create a function for each thing, ex: createCharacter and this way I guess we are writing more code, but being more
    // explicit and clear what a function means
    function createCharacter()
    {
        $scope.pageNum = 1;
        console.log("User " + $scope.uname + " wants to create a new character by going to pageNum " + $scope.pageNum);
        mainApi.changePage($scope.pageNum).success(function (raceRows) {
            $scope.races = raceRows;
        }).error(function (raceRows)
        {
            console.log("Error while retrieving races " + raceRows);
        });
    }

    function displayCharacters()
    {
        console.log("Fetching all characters...");

        mainApi.changePage(1, $scope.username, null).success(function (rows){
            $scope.characters = rows;
        }).error(function (rows)
        {
            console.log("Error while retrieving characters " + rows);
        })
    }

}

function mainApi($http, apiUrl)
{
    return {
        logInUser: function (uname, pword)
        {
            var url = apiUrl + '/login?uname=' + uname + '&pword=' + pword;
            return $http.get(url);
        },
        // This is a abstract function that can be called with a value between 1-10 to reach different pages
        changePage: function (pageNum, opt1, opt2)
        {
            var url = apiUrl + '/meta?page=' + pageNum;

            // If extra options
            if(opt1 != null)
            {
                url += '&opt1=' + opt1;
            }

            // If extra options
            if(opt2 != null)
            {
                url += '&opt2=' + opt2;
            }
            return $http.get(url);
        },
        changeRaceClass: function (race, charClass, subClass) {
            var url = apiUrl + '/changeRaceClass?page=10&race=' + race + '&charClass=' + charClass + '&subClass=' + subClass;
            return $http.get(url);
        }
    };
}