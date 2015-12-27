appZZcloud.controller('cloudController', function ($scope, $http, $ionicScrollDelegate, $ionicPopup, $ionicLoading) {

    $scope.urlBase = "http://achini.ddns.net/owncloud/remote.php/webdav";

    $scope.headerConfig = {
        headers: {
            'Authorization': 'Basic YXVndXN0aW46c2F1Y2lzc2U8Mw=='
        }
    };

    // init of the cloud controller
    $scope.init = function(){

        $scope.showDelete = false;

        $scope.displayTree("/");
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


    // confirm dialog
    $scope.showConfirm = function(name) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Enregistement',
            template: 'Voulez-vous télècharger ce fichier et l\'enregister ?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                
                // call the function to download the file
                $scope.download(name, $scope.urlBase + "/" + $scope.tree.join('/'));

            }
        });
    };

    /*
     * ---- HTTP reqests ----
     */

    $scope.webDavRequest = function(type, name){
    
        if (type == "Collection") {
            $scope.goToNode(name);
            $scope.displayTree(name);
        }
        else
        {
            
            $scope.showConfirm(name);

        }
    }

    $scope.displayTree = function (name) {

        if (name != '/')
            name = "/" + $scope.tree.join('/');
        else
            $scope.tree = [];

        $http.get($scope.urlBase + name, $scope.headerConfig).then(function (response) {
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

    $scope.download = function(name, url) {

        $ionicLoading.show({template: 'Loading...'});

        document.addEventListener("deviceready", function() {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
                fs.root.getDirectory(
                    "ZZcloud/data",
                    {
                        create: true
                    },
                    function(dirEntry) {
                        dirEntry.getFile(
                            name, 
                            {
                                create: true, 
                                exclusive: false
                            }, 
                            function gotFileEntry(fe) {
                                var p = fe.toURL();
                                fe.remove();
                                ft = new FileTransfer();
                                ft.download(

                                    //URL
                                    encodeURI(url+'/'+name),

                                    // file path
                                    p,
                                    function(entry) {
                                        $ionicLoading.hide();
                                        alert(entry.toURL());
                                    },
                                    function(error) {
                                        $ionicLoading.hide();
                                        alert("Download Error Source -> " + error.source);
                                    },
                                    false,
                                    $scope.headerConfig
                                );
                            }, 
                            function() {
                            $ionicLoading.hide();
                            console.log("Get file failed");
                            }
                        );
                    }
                );
            },
            function() {
            $ionicLoading.hide();
            console.log("Request for filesystem failed");
            }); 
        });
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

appZZcloud.controller('profileController', function ($scope, $ionicLoading) {

    // init of the cloud controller
    $scope.init = function(){

        
    }

    $scope.init();
});