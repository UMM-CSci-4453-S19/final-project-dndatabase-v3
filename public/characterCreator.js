angular.module('characterCreator', ['angular.filter'])
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
    $scope.formCtrlData = [];

    $scope.loading = false;
    $scope.race = {};
    $scope.class = {};
    $scope.subClass = {};
    $scope.currentCharacter = {};
    $scope.emptyCharacter = {
        classId: 0,
        subclassId: 0
    };
    $scope.setCharTest = setCharTest;
    $scope.selectCharacter = selectCharacter;
    $scope.submitEdits = submitEdits;
    $scope.newCharacter = newCharacter;


    //Page 2 Race
    var page1CtrlArr = ['raceCtrl'];
    var _raceVal = '';
    $scope.raceCtrl = {
        value: function (newVal) {
            return arguments.length ? (_raceVal = newVal) : _raceVal;
        }
    };

    //Page 3 Class/subclass

    page2CtrlArr = ['classCtrl', 'subclassCtrl'];

    var classVal = '';
    $scope.classCtrl = {
        value: function (newVal) {
            return arguments.length ? (classVal = newVal) : classVal;
        }
    };

    var subclassVal = '';
    $scope.subclassCtrl = {
        value: function (newVal) {
            return arguments.length ? (subclassVal = newVal) : subclassVal;
        }
    };

    //Page 4 Stats!!!
    $scope.strCtrl = '';
    $scope.dexCtrl = '';
    $scope.conCtrl = '';
    $scope.chaCtrl = '';
    $scope.intCtrl = '';
    $scope.wisCtrl = '';

    var strVal = '';
    $scope.strCtrl = {
        value: function(newVal) {
            return arguments.length ? (strVal = newVal) : strVal;
        }
    };

    var dexVal = '';
    $scope.dexCtrl = {
        value: function(newVal) {
            return arguments.length ? (dexVal = newVal) : dexVal;
        }
    };

    var conVal = '';
    $scope.conCtrl = {
        value: function(newVal) {
            return arguments.length ? (conVal = newVal) : conVal;
        }
    };

    var chaVal = '';
    $scope.chaCtrl = {
        value: function(newVal) {
            return arguments.length ? (chaVal = newVal) : chaVal;
        }
    };

    var intVal = '';
    $scope.intCtrl = {
        value: function(newVal) {
            return arguments.length ? (intVal = newVal) : intVal;
        }
    };

    var wisVal = '';
    $scope.wisCtrl = {
        value: function(newVal) {
            return arguments.length ? (wisVal = newVal) : wisVal;
        }
    };
    // page 5 skills/abilities

    var page5CtrlArr = ['power1Ctrl', 'power2Ctrl'];

    var _power1Val = '';
    $scope.power1Ctrl = {
        value: function(newVal) {
            return arguments.length ? (_power1Val = newVal) : _power1Val;
        },
    };

    var _power2Val = '';
    $scope.power2Ctrl = {
        value: function(newVal) {
            return arguments.length ? (_power2Val = newVal) : _power2Val;
        },
    };

    // page 8 weapons as part of equipment

    page7CtrlArr = ['weaponCtrl', 'weapon2Ctrl', 'armorCtrl'];

    var weaponVal = '';
    $scope.weaponCtrl = {
        value: function(newVal) {
            return arguments.length ? (weaponVal = newVal) : weaponVal;
        }
    };

    var weapon2Val = '';
    $scope.weapon2Ctrl = {
        value: function(newVal) {
            return arguments.length ? (weapon2Val = newVal) : weapon2Val;
        }
    };

    var armorVal = '';
    $scope.armorCtrl = {
        value: function(newVal) {
            return arguments.length ? (armorVal = newVal) : armorVal;
        }
    };

    $scope.serverData = [];

    // page 7 proficiencies
    $scope.prof1Ctrl = '';
    $scope.prof2Ctrl = '';
    $scope.prof3Ctrl = '';

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
                // genericCall(null, null, 'serverData');
                console.log('current character Id: ' + $scope.currentCharacter.characterId);
                extendedGenericCall($scope.currentCharacter.characterId, null,
                    null, null, null,
                    'serverData', 'formCtrlData', page1CtrlArr);
                break;
            case 2:
                console.log('page 2!');
                //genericCall(null, null, 'serverData');
                extendedGenericCall($scope.currentCharacter.characterId, null,
                    null, null, null,
                    'serverData', 'formCtrlData', page2CtrlArr);
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
                // formCtrlData is being set here!!
                console.log('page 5!');
                extendedGenericCall($scope.currentCharacter.classId, $scope.currentCharacter.subclassId,
                    $scope.uname, $scope.currentCharacter.characterId, $scope.currentCharacter.level,
                    'serverData', 'formCtrlData', page5CtrlArr);
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
    function extendedGenericCall(param1, param2, param3, param4, param5, scopeVar, scopeVar2, fCtrlArr) {
        mainApi.changePage($scope.curPage, param1, param2, param3, param4, param5).success(function (serverData) {
            console.log('returned data from request!!!, ', serverData);
            if (scopeVar&&scopeVar2) {
                $scope[scopeVar] = serverData[0];
                $scope[scopeVar2] = serverData[1];
            } else if (scopeVar) {
                $scope[scopeVar] = serverData;
            } else if (scopeVar2) {
                $scope[scopeVar2] = serverData;
            }
            if ($scope.formCtrlData[0]) {
                setCtrls(fCtrlArr);
            }
            $scope.loading = false;
        }).error(function (serverData)
        {
            console.log("Error while retrieving data " + serverData);
        });
    }
    function setCtrls(fCtrlArr) {
        console.log('setting formControls!!!');
        console.log('serverData, ', $scope.formCtrlData[0]);
        var ctrlsObj = $scope.formCtrlData[0];
        for (var i = 0; i < fCtrlArr.length; i++) {

            if ($scope.formCtrlData[0] && ($scope[fCtrlArr[i]].value() === '')) {
                var currentKey = Object.keys(ctrlsObj)[i];
                $scope[fCtrlArr[i]].value($scope.formCtrlData[0][currentKey]);
                console.log($scope[fCtrlArr[i]].value());
            }
        }
    }

    function logOut()
    {
        $scope.logged_in = !$scope.logged_in;
        $scope.curPage = 0;
        $scope.currentCharacter = {};
    }
    function selectCharacter(char) {
        $scope.currentCharacter = char;
        $scope.curPage++;
        setPage($scope.curPage);
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
            {raceId: $scope.raceCtrl.value()},
            // page 2 ctrl values
            {class: $scope.classCtrl.value(), subclass: $scope.subclassCtrl.value()},
            // page 3 ctrl values
            {},
            // page 4 ctrl values
            {},
            // page 5 ctrl values
            {power1: $scope.power1Ctrl.value(), power2: $scope.power2Ctrl.value()},
            // page 6 ctrl values
            {prof1: $scope.prof1Ctrl.value(), prof2: $scope.prof2Ctrl.value(), prof3: $scope.prof3Ctrl.value()},
            // page 7 ctrl values
            {weapon: $scope.weaponCtrl.value(), weapon2: $scope.weapon2Ctrl.value(), subclass: $scope.armorCtrl.value()},
            // page 8 ctrl values
            {},
            // page 9 ctrl values
            {}];
        mainApi.submitCharacter(pageArr, $scope.addMode, $scope.currentCharacter.characterId, $scope.username).success(function (res) {
            console.log('successful submission made!');
            $scope.curPage = 0;
        });
    }

    function setCharTest(char) {
        $scope.currentCharacter = char;
        console.log('current character has been set', $scope.currentCharacter);
    }

    function newCharacter()
    {
        mainApi.newCharacter($scope.uname, document.getElementById("newCharBox").value).success(function (rows){
            $scope.currentCharacter = rows;
        });
        next();
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
        newCharacter: function(uname, cname)
        {
            var url = apiUrl + '/new?uname=' + uname + '&cname=' + cname;
            return $http.get(url);
        },
        // This is a abstract function that can be called with a value between 1-10 to reach different pages
        changePage: function (pageNum, opt1, opt2, opt3, opt4, opt5)
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

            // If extra options
            if(opt3 != null)
            {
                url += '&opt3=' + opt3;
            }

            // If extra options
            if(opt4 != null)
            {
                url += '&opt4=' + opt4;
            }

            // If extra options
            if(opt5 != null)
            {
                url += '&opt5=' + opt5;
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