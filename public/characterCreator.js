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

}

function mainApi($http, apiUrl)
{
    return {
        logInUser: function (uname, pword)
        {
            var url = apiUrl + '/login?uname=' + uname + '&pword=' + pword;
            return $http.get(url);
        }
    };
}