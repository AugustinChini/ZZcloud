appZZcloud.controller('cloudController', function ($scope, $http, $ionicScrollDelegate) {

    // init of the cloud controller
    $scope.init = function(){

        $scope.showDelete = false;

        $scope.getTree("/");
    }

    // should we show the delete button ?
    $scope.shouldShowDelete = function(){

        if($scope.showDelete)
        {
            $scope.showDelete = false;
        }
        else{

            $scope.showDelete = true;
        }

        return $scope.showDelete;

    }



    /*
     * ---- HTTP reqests ----
     */

    $scope.webDavRequest = function(type, name){
    
        if (type == "Collection") {
            $scope.goToNode(name);
            $scope.getTree(name);
        }
        else
            alert("files are not supported ... yet");
    }

    $scope.getTree = function (name) {

        if (name != '/')
            name = "/" + $scope.tree.join('/');
        else
            $scope.tree = [];

        var config = {
            headers: {
                'Authorization': 'Basic YXVndXN0aW46c2F1Y2lzc2U8Mw=='
            }
        };
        $http.get("http://192.168.1.25/owncloud/remote.php/webdav" + name, config).then(function (response) {
            $scope.arrayItems = htmlToJsonParser(response.data);
            $ionicScrollDelegate.scrollTop(true);
        }, function (error) {

            // change and use ionic popup to show errors
            alert(error);
        });
    }

    $scope.tree = [];

    $scope.goToNode = function (node) {

        var find = false;

        for(var i = 0; i<$scope.tree.length; ++i)
        {
            if (node == $scope.tree[i])
            {
                $scope.tree.splice(i + 1);
                find = true;
                break;
            }
        }

        if(!find)
        {
            $scope.tree.push(node);
        }

    }

 //Class Item to each file/folder read by a parser when GET request is performed
    function Item(name, link, type, size, date) {
        this.name = name;
        this.link = link;
        this.type = type; 
        this.size = size;//en octets
        this.date = date;
    }

    function DateObject(day, month, year, hour, minutes, seconds) {
        this.day = day;
        this.month = month;
        this.year = year;
        this.hour = hour;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    //The parser reads html code and instanciates objects Item
    function htmlToJsonParser(htmlCode) {
        var arrayItems = [];

        var table = htmlCode.split('<table')[1].split('</table>')[0];
        var rows = table.split('<tr');
        //index 0 is empty, 1 is the first row (titles)
        for(i=2;i<rows.length;i++) {
            var cells = rows[i].split('<td');
            if(cells.length >= 6 && (cells[2]).indexOf(">..<") == -1) {
                var link = cells[2].split('<a href="')[1].split('"')[0];
                var name = cells[2].split(link+'">')[1].split("</a>")[0];
                var type = cells[3].split('>')[1].split('</td')[0];
                var size = cells[4].split('>')[1].split('</td')[0];
                var dateStr = cells[5].split('>')[1].split('</td')[0];

                var date = parseDateToFrenchFormat(dateStr);

                var item = new Item(name, link, type, size, date);

                arrayItems.push(item);
            
            }
        }
            
        return arrayItems;
    }

    function parseDateToFrenchFormat(dateStr) {

        var date;
        var month;
        var year;
        var day;
        var hour;
        var minutes;
        var seconds;

        if(dateStr != "")
        {
             day = dateStr.split("-")[2].split("T")[0];
             month = dateStr.split("-")[1];
             year = dateStr.split("-")[0];
             hour = dateStr.split("T")[1].split(":")[0];
             minutes = dateStr.split(":")[1];
             seconds = dateStr.split(":")[2].split("+")[0];
    
        }
        
        date = new DateObject(day, month, year, hour, minutes, seconds);

        return date;
    }


    $scope.init();
});
