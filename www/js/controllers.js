appZZcloud.controller('getWebDavContent', function($scope, $http) {
    $scope.webDavRequest = function(){

        var config = {headers:  {
                'Authorization': 'Basic YXVndXN0aW46c2F1Y2lzc2U8Mw=='
            }
        };
        $http.get("http://achini.ddns.net/owncloud/remote.php/webdav/", config)
        .success(function(data) {
            $scope.arbo = data;
        })
        .error(function(data) {
            alert("ERROR");
        });
        /*var url = 'http://achini.ddns.net/owncloud/remote.php/webdav/';
        var username = "augustin";
        var password = "saucisse<3";

        var xhr = $scope.createCORSRequest('GET', url, username, password);
        if (!xhr) {
            $scope.arbo = "Erreur : requête CORS non supporté.";
            return;
        }

        // écouteurs le réponse async.
        xhr.onload = function() {
            $scope.arbo = xhr.responseText;
        };

        xhr.onerror = function() {
            $scope.arbo = "Erreur lors de la création de la requête"
        };
        
        xhr.send();*/
    }

        // création de l'objet XHR.
    /*$scope.createCORSRequest = function createCORSRequest(method, url, username, password) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR pour Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true, username, password);
            xhr.withCredentials = true;
        } else if (typeof XDomainRequest != "undefined") {
            // IE.
            xhr = new XDomainRequest();
            xhr.open(method, url, true, username, password);
            xhr.withCredentials = true;
        } else {
            // CORS non supporté.
            xhr = null;
        }
        return xhr;
    }*/

});