appZZcloud.controller('getWebDavContent', function($scope, $http) {
    $scope.webDavRequest = function(){

        var url = 'http://fc.isima.fr/~chiniaug/getWebDAV.php';

        var xhr = $scope.createCORSRequest('GET', url);
        if (!xhr) {
            $scope.arbo = "Erreur : requête CORS non supporté.";
            return;
        }

        
        xhr.send();

        // écouteurs le réponse async.
        xhr.onload = function() {
            $scope.arbo = xhr.responseText;
        };

        xhr.onerror = function() {
            $scope.arbo = "Erreur lors de la création de la requête"
        };
    }

        // création de l'objet XHR.
    $scope.createCORSRequest = function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR pour Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS non supporté.
            xhr = null;
        }
        return xhr;
    }

});