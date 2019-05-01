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
    $scope.race = -1;
    $scope.class = -1;

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
        changePage: function (pageNum)
        {
            var url = apiUrl + '/meta?page=' + pageNum;
            return $http.get(url);
        }
    };
}