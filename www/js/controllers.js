appZZcloud.controller('getWebDavContent', function($scope, $http) {
    $scope.webDavRequest = function(){

        var config = {headers:  {
                'Authorization': 'Basic YXVndXN0aW46c2F1Y2lzc2U8Mw=='
            }
        };
        $http.get("http://achini.ddns.net/owncloud/remote.php/webdav/", config).then(function(response) {
            $scope.arrayItems = htmlToJsonParser(response.data);
        }, function(error) {
            $scope.arbo = error;
        });
    }

    //Class Item to each file/folder read by a parser when GET request is performed
    function Item(name, link, type, size, date) {
        this.name = name;
        this.link = link;
        this.type = type; //en octets
        this.size = size;
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
            if(cells.length >= 6) {
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
        var day = dateStr.split("-")[2].split("T")[0];
        var month = dateStr.split("-")[1];
        var year = dateStr.split("-")[0];
        var hour = dateStr.split("T")[1].split(":")[0];
        var minutes = dateStr.split(":")[1];
        var seconds = dateStr.split(":")[2].split("+")[0];

        var date = new DateObject(day, month, year, hour, minutes, seconds);

        return date;
    }
});