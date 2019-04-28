angular.module('characterCreator', [])
    .controller('mainCtrl', MainCtrl)
    .factory('mainApi', mainApi)
    //.factory('transactionApi', transactionApi)
    .constant('apiUrl', 'http://localhost:1337'); // CHANGED for the lab 2017!

function MainCtrl($scope, mainApi)
{
    $scope.logOut = logOut;
    $scope.logged_in = false;
    $scope.logIn = logIn;
    $scope.uname = '';
    $scope.pword = '';
    $scope.pageArr = [true, false, false, false, false, false, false, false, false];
    $scope.curPage = 0;
    $scope.next = next;
    $scope.prev = prev;

    $scope.createCharacter = createCharacter;
    $scope.races = null;

    function logIn(uname, pword)
    {
        console.log("Trying to log in with name " + uname + " and password " + pword);
        mainApi.logInUser(uname, pword).success(function (rows)
        {
            $scope.logged_in = rows;
            setPage(0);
        }).error(function (rows)
        {
            console.log(rows);
        });
    }

    function setPage(pageNum) {
        console.log(pageNum);
        for (var i = 0; i < $scope.pageArr.length; i++) {
            if (i == pageNum) {
                $scope.pageArr[i] = true;
                $scope.curPage = i;
            } else {
                $scope.pageArr[i] = false;
            }
        }
        console.log($scope.pageArr);
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