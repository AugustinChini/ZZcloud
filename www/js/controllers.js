appZZcloud.controller('getWebDavContent', function($scope, $http) {
    $scope.webDavRequest = function(){

        var config = {headers:  {
                'Authorization': 'Basic YXVndXN0aW46c2F1Y2lzc2U8Mw=='
            }
        };
        $http.get("http://achini.ddns.net/owncloud/remote.php/webdav/", config).then(function(data) {
            $scope.arbo = data;
        }, function(data) {
            $scope.arbo = data;
        });
    }

});