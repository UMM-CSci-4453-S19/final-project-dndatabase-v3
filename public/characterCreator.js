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
    $scope.pageArr = [true, false, false, false, false, false, false, false, false];
    $scope.curPage = 0;
    $scope.serverData = [];


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

    function logOut()
    {
        $scope.logged_in = !$scope.logged_in;
    }

    function setPage(pageNum) {
        console.log("Before set Page runs " + pageNum);
        for (var i = 0; i < $scope.pageArr.length; i++) {
            if (i === pageNum) {
                $scope.pageArr[i] = true;
                $scope.curPage = i;
            } else {
                $scope.pageArr[i] = false;
            }
        }
        console.log("After set page runs " + $scope.pageArr);
        $scope.serverData = null;
        mainApi.changePage($scope.curPage).success(function (response) {
            $scope.serverData = response;
        }).error(function (response)
        {
            console.log("Error while retrieving server data " + response);
        });
    }

    function prev() {
        if ($scope.curPage > 0) {
            $scope.curPage--;
            setPage($scope.curPage);
            console.log($scope.curPage);
        }
    }

    function next() {
        if ($scope.curPage < $scope.pageArr.length - 1) {
            $scope.curPage++;
            setPage($scope.curPage);
            console.log("clicking next makes current page " + $scope.curPage);
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