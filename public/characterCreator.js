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


    function logIn(uname, pword)
    {
        console.log("Trying to log in with name " + uname + " and password " + pword);
        mainApi.logInUser(uname, pword).success(function (rows)
        {
            $scope.logged_in = rows;
        }).error(function (rows)
        {
            console.log(rows);
        });
    }

    function logOut()
    {
        $scope.logged_in = !$scope.logged_in;
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