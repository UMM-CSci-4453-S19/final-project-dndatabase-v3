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
    $scope.addMode = false;
    $scope.uname = '';
    $scope.pword = '';
    $scope.curPage = 0;
    $scope.serverData = [];

    $scope.loading = false;
    $scope.race = {};
    $scope.class = {};
    $scope.subClass = {};
    $scope.currentCharacter = {};
    $scope.emptyCharacter = {
        classId: 0,
        subclassId: 0,
    };
    $scope.setCharTest = setCharTest;
    $scope.selectCharacter = selectCharacter;
    $scope.submitEdits = submitEdits;

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

    var _power2Val = '';
    $scope.power2Ctrl = {
        value: function(newVal) {
            return arguments.length ? (_power2Val = newVal) : _power2Val;
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

    var prof1Val = '';
    $scope.prof1Ctrl = {
        value: function(newVal) {
            return arguments.length ? (prof1Val = newVal) : prof1Val;
        }
    };

    var prof2Val = '';
    $scope.prof2Ctrl = {
        value: function(newVal) {
            return arguments.length ? (prof2Val = newVal) : prof2Val;
        }
    };

    var prof3Val = '';
    $scope.prof3Ctrl = {
        value: function(newVal) {
            return arguments.length ? (prof3Val = newVal) : prof3Val;
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
        switch(pageNum) {
            case 0:
                console.log('page 0!');
                genericCall($scope.uname, null, 'characters');
                break;
            case 1:
                console.log('page 1!');
                genericCall($scope.uname, null, 'serverData');
                break;
            case 2:
                console.log('page 2!');
                genericCall(null, null, 'serverData');
                break;
            case 3:
                console.log('page 3!');
                genericCall(null, null, 'serverData');
                break;
            case 4:
                console.log('page 4!');
                genericCall(null, null, 'serverData');
                break;
            case 5:
                console.log('page 5!');
                genericCall($scope.currentCharacter.classId, $scope.currentCharacter.subclassId , 'serverData');
                break;
            case 6:
                console.log('page 6!');
                genericCall(null, null, 'serverData');
                break;
            case 7:
                console.log('page 7!');
                genericCall(null, null, 'serverData');
                break;
            case 8:
                console.log('page 8!');
                genericCall(null, null, 'serverData');
                break;
            case 9:
                console.log('page 9!');
                genericCall(null, null, 'serverData');
                break;
        }
    }

    function genericCall(param1, param2, scopeVar) {
        mainApi.changePage($scope.curPage, param1, param2).success(function (serverData) {
            if (scopeVar) {
                $scope[scopeVar] = serverData;
                console.log('stuff from the server!!!! ' , $scope[scopeVar]);
            }
            $scope.loading = false;
        }).error(function (serverData)
        {
            console.log("Error while retrieving data " + serverData);
        });
    }

    function logOut()
    {
        $scope.logged_in = !$scope.logged_in;
        $scope.curPage = 0;
        $scope.currentCharacter = {};
    }
    function selectCharacter(char) {
        $scope.curPage++;
        setPage($scope.curPage);
        $scope.currentCharacter = char;
        $scope.addMode = false;
        console.log('addmode change', $scope.addMode);
    }
    function next() {
        if ($scope.curPage < 9) {
            $scope.curPage++;
            setPage($scope.curPage);
            console.log($scope.curPage);
        }
        if ($scope.curPage === 1) {
            $scope.currentCharacter = $scope.emptyCharacter;
            $scope.addMode = true;
            console.log('addmode change', $scope.addMode);
        }
    }
    function prev() {
        if ($scope.curPage > 0) {
            $scope.curPage--;
            setPage($scope.curPage);
            console.log($scope.curPage);
        }
    }
    // submit edits handles both add and update
    // an array is build which has formcontrol values arranges as object attributes for each page
    // this is sent in a post request to the server
    function submitEdits() {
        var pageArr = [
            // page 1 ctrl values
            {},
            // page 2 ctrl values
            {},
            // page 3 ctrl values
            {},
            // page 4 ctrl values
            {},
            // page 5 ctrl values
            {power1: $scope.power1Ctrl.value(), power2: $scope.power2Ctrl.value()},
            // page 6 ctrl values
            {prof1: $scope.prof1Ctrl.value(), prof2: $scope.prof2Ctrl.value(), prof3: $scope.prof3Ctrl.value()},
            // page 7 ctrl values
            {},
            // page 8 ctrl values
            {},
            // page 9 ctrl values
            {}];
        mainApi.submitCharacter(pageArr, $scope.addMode, $scope.currentCharacter.characterId, $scope.user).success(function (res) {
            console.log('successful submission made!');
            $scope.curPage = 0;
        });
    }

    function setCharTest(char) {
        $scope.currentCharacter = char;
        console.log('current character has been set', $scope.currentCharacter);
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
            $scope.loading = false;
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
        submitCharacter: function (pageArr, add, charId, user) {
            var addUrl = '/character?message=add&characterId=' + charId + '&user=' + user;
            var editUrl = '/character?message=update&characterId=' + charId + '&user=' + user;
            if (add) {
                return $http.post(addUrl, pageArr);
            } else {
                return $http.post(editUrl, pageArr);
            }
        }
    };
}