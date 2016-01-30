appZZcloud.controller('cloudController', function ($scope, $state, $http, $ionicScrollDelegate, $ionicPopup, $ionicLoading, $timeout, $cordovaFile, $cordovaFileTransfer, $cordovaFileOpener2, $cordovaSocialSharing) {

    // object which incude all the login informations
    $scope.login = {
        "urlBase": 'http://192.168.1.25',
        "url": 'http://192.168.1.25/owncloud/remote.php/webdav',
        "username": "augustin",
        "password": "saucisse<3"
    };


    $scope.urlBase = $scope.login.url;

    $scope.headerConfig = {
        headers: {
            'Authorization': 'Basic '+btoa($scope.login.username+':'+$scope.login.password),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    $scope.tree = [];

    $scope.resizedTree = [];

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

    $scope.onItemDelete = function(item)
    {
        $ionicLoading.show(); 
        $http.delete($scope.urlBase + "/" + $scope.tree.join('/') + '/' + item.name, $scope.headerConfig);
        $scope.shouldShowDelete();
        setTimeout(function(){ 
            $scope.displayTree("/" + $scope.tree.join('/'));
            $ionicLoading.hide(); 
        }, 500);
    }


    $scope.shareItem = function (item)
    {
           var sharePopup = $ionicPopup.show({
                title: 'Share Link',
                template: 'Send link by ...',
                cancelType: 'button-balanced',
                okType: 'button-positive',
                buttons: [
                    {
                        text: 'SMS',
                        type: 'button-balanced',
                        onTap: function(e) {
                            e.preventDefault();
                            //$scope.getShareLink(item.link);
                            sharePopup.close();
                            $state.go('side.share', { type: "sms"});
                        }
                    },
                    {
                        text: '<b>eMail</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            e.preventDefault();
                            //$scope.getShareLink(item.link);
                            $state.go('side.share', { type: "email"});
                            sharePopup.close();
                        }
                    }
                ]
           });

        $timeout(function() {
            sharePopup.close(); //close the popup after 3 seconds for some reason
        }, 3000);
    }

    $scope.getShareLink = function (link) {

        link = link.split("webdav");
        link = link[1];

        $http.post($scope.login.urlBase + "/owncloud/ocs/v1.php/apps/files_sharing/api/v1/shares", "path=" + link + "&shareType=3" ,$scope.headerConfig).then(function (response) {

            var resp = JSON.stringify(response);
            resp = resp.split("<token>");
            resp = resp[1].split("</token>");
            resp = resp[0];




        }, function (error) {

            alert(error.message);

        });
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
    
        // if its a folder and not a shorted tree node
        if (type == "Collection" && name != "...") {

            // Maj the tree bar
            $scope.goToNode(name);

            // display the content of the folder
            $scope.displayTree(name);
        }
        // if its a file and not a shorted tree node
        else if (name != "...")
        {
            // show confirm box and download the file
            $scope.showConfirm(name);

        }
    }

    $scope.displayTree = function (name) {

        if (name != '/'){
            name = "/" + $scope.tree.join('/');
        }
        else
        {
            $scope.tree = [];
            $scope.resizedTree = [];
        }

        $http.get($scope.urlBase + name, $scope.headerConfig).then(function (response) {
            $scope.arrayItems = htmlToJsonParser(response.data);
            $ionicScrollDelegate.scrollTop(true);
        }, function (error) {

            // change and use ionic popup to show errors
            /*alert("Resqest fail on : \"" + error.config.url + "\" check your internet connetion or maybe your cloud provider is not reachable.");*/
            alert(JSON.stringify(error));

        });
    }

    $scope.goToNode = function (node) {

        var find = false;

        for(var i = 0; i<$scope.tree.length; ++i)
        {
            if (node == $scope.tree[i])
            {
                $scope.tree.splice(i + 1);

                $scope.resizedTree = [];
                //$scope.resizedTree = $scope.tree;
                for(var j = 0; j<$scope.tree.length; ++j)
                    $scope.resizedTree[j] = $scope.tree[j];

                $scope.resizeTree();
                find = true;
                break;
            }
        }

        if(!find)
        {
            $scope.tree.push(node);
            $scope.resizedTree.push(node);
            $scope.resizeTree();
        }

    }

    $scope.download = function(name, url) {

        $ionicLoading.show({template: 'Loading...'});

        document.addEventListener("deviceready", function() {

            // only in android FS IOS --> documentDirectory
            var targetPath = cordova.file.externalRootDirectory + "Download/" + name;
            var trustHosts = true;

            $cordovaFileTransfer.download(url+'/'+name, targetPath, $scope.headerConfig, trustHosts)
            .then(function(result) {

                setTimeout(function(){ $ionicLoading.hide(); }, 300);
                $scope.fileOpener(name, targetPath);

            }, function(err) {

                alert('error: ' + JSON.stringify(err));
                setTimeout(function(){ $ionicLoading.hide(); }, 300);

            }, function (progress) {

                $timeout(function () {

                    // display % of download
                    $ionicLoading.show({template: "Loading : "+((progress.loaded / progress.total) * 100).toFixed(1)+" %"});

                })

            });

        });

    };

    $scope.fileOpener = function (name, path)
    {
        // Set array of extentions
        textFiles = ["txt", "md", "c", "h", "hpp", "cpp", "java", "conf", "sh", "hxx", "php", "js", "css", "rtf"];

        imgFiles = ["jpg", "JPG", "png", "PNG", "jpeg", "JPEG", "svg"];

        mediaFiles = ["mp3", "MP3", "avi", "AVI", "mp4", "MP4", "flv", "FLV", "mkv", "wma", "wmv" ];

        name = name.split(".");

        var ext = name[name.length-1];

        if (textFiles.indexOf(ext) > -1)
        {
            // go to textReader
            window.resolveLocalFileSystemURL(path, gotFile, fail);

            function fail(e) {
                alert("error : could not read this file.");
            }

            function gotFile(fileEntry) {

                fileEntry.file(function(file) {
                    var reader = new FileReader();

                    reader.onloadend = function(e) {

                        $state.go('side.textReader', { txt: this.result});

                    }

                    reader.readAsText(file);
                });

            }
        }
        else if (imgFiles.indexOf(ext) > -1)
        {
            // go to imgReader
            $state.go('side.imgReader', { img: path});
        }
        else if (mediaFiles.indexOf(ext) > -1)
        {
            // the media files aren't supported by the application yet ...
            alert("This media files are not supported by the application yet, but your file have been saved to your Download folder. ")
        }
        else
        {

            // it's probably an app
            $cordovaFileOpener2.open(
                path,
                'application/'+ext
            ).then(function() {
                console.log('Success');
            }, function(err) {
                alert('You haven\'t the default application to open this file. It was saved to your \'Download\' folder.');
            });
        }
    };

    $scope.resizeTree = function ()
    {
        var treeStringLength = 0;

        for(var i = 0; i < $scope.resizedTree.length; ++i)
        {
            treeStringLength += $scope.resizedTree[i].length;
        }

        if(treeStringLength > 20)
        {
            while(treeStringLength > 20)
            {
                if($scope.resizedTree.indexOf("...") != -1)
                {
                    // we cut the 2nd element to shorten the displayed tree
                    treeStringLength -= $scope.resizedTree[1].length;
                    $scope.resizedTree.splice(1,1);
                }
                else
                {
                    $scope.resizedTree[0] = "...";
                }
                
            }
        }
    }


    // Class Item to each file/folder read by a parser when GET request is performed
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

    // init of the profile controller
    $scope.init = function(){

        
    }

    $scope.init();
});

appZZcloud.controller('imgReaderController', function ($scope, $stateParams) {

    // init of the imgReaderController controller
    $scope.init = function(){

        $scope.img = $stateParams.img;
    }

    $scope.init();
});

appZZcloud.controller('textReaderController', function ($scope, $stateParams) {

    // init of the textReaderController controller
    $scope.init = function(){

        $scope.txt = $stateParams.txt;
    }

    $scope.init();
});

appZZcloud.controller('shareController', function ($scope, $stateParams, $cordovaContacts) {
    
    $scope.findContactsBySearchTerm = function (searchTerm) {

        function onSuccess(contacts) {
            $scope.contacts = contacts;
        };

        function onError(contactError) {
            alert('Error!');
        };

        // find all contacts with 'Bob' in any name field
        var options      = new ContactFindOptions();
        options.filter   = "Au";
        options.multiple = true;
        options.desiredFields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name, navigator.contacts.fieldType.phoneNumbers, navigator.contacts.fieldType.emails, navigator.contacts.fieldType.photos];
        var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
        navigator.contacts.find(fields, onSuccess, onError, options);

    };

    $scope.init = function(){

        $scope.findContactsBySearchTerm("Augustin");

        //alert(JSON.stringify($scope.contacts));

    }

    $scope.init();

});

appZZcloud.controller('loginController', function ($scope, $state, $http, $cordovaFileTransfer, $cordovaFile) {

   /*document.addEventListener("deviceready", function() {
        var path = cordova.file.applicationStorageDirectory;

        $cordovaFile.checkFile(path, "login.json")
        .then(function (success) {
            // success
          }, function (error) {
            // error
          });



        if(!) {
            $scope.checkLogin = function($url, $username, $password) {
                */$scope.login = {
                    "url": 'http://achini.ddns.net/owncloud/remote.php/webdav',
                    "username": "augustin",
                    "password": "saucisse<3"
                };/*

                $scope.headerConfig = {
                    headers: {
                        'Authorization': 'Basic '+btoa($scope.login.username+':'+$scope.login.password)
                    }
                };

                $http.get($scope.login.url, $scope.headerConfig)
                    .then(function (response) {
                        writeFileJson();
                        $state.go("side.home");
                    }, function (error) {
                        // change and use ionic popup to show errors
                        alert("Erreur à l'identification !");
                });

                function writeFileJson() {
                    $cordovaFile.writeFile(path, "login.json", JSON.stringify($scope.login), true)
                }
            }
        }
        else
        {
            $scope.login = JSON.parse($cordovaFile.readAsText(cordova.file.applicationStorageDirectory,"login.json"));
            */$state.go("side.home");/*
        }
    });*/

});