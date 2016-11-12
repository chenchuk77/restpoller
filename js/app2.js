'use strict';
angular.module('myApp', [])
    .controller('MovieController', function($scope, $http){
        $scope.appname='RestLoop';
        $scope.url='http://';
        $scope.currentEnvironment = 0;
        $scope.intvl = 2000;
        $scope.firstRun = false;

        // init params,
        $scope.init = function () {
            $scope.currentEnvironment ++ ;
            $scope.counter = 0;
            $scope.records=[];
            $scope.index = -1;
            //$scope.last_obj = {};
            $scope.obj = {};
            $scope.url = "http://jsonplaceholder.typicode.com/posts/"
        };

        // load a new timer for getting data, init the environment to clear old data.
        $scope.start = function(){
            $scope.firstRun = true;

            // remove old table if exists
            var table = document.getElementById("obj_table");
            if (table){
                // table exists
                document.getElementById("table_placeholder").removeChild(table);
            }

            // clear and start a new timer
            clearInterval($scope.timer);
            $scope.init();
            $scope.timer = setInterval($scope.getNewData, $scope.intvl);
            console.log("starting new env: " + $scope.currentEnvironment +
                ", freq_ms: " +$scope.intvl+
                ", counter: " + $scope.counter);
        };

        // load a new timer for getting data, continue run on same environment.
        $scope.cont = function(){
            // clear and start a new timer
            clearInterval($scope.timer);
            $scope.timer = setInterval($scope.getNewData, $scope.intvl);
            console.log("continue env: " + $scope.currentEnvironment +
                ", freq_ms: " +$scope.intvl+
                ", counter: " + $scope.counter);
        };

        // stop polling
        $scope.stop = function(){
            // clear and start a new timer
            clearInterval($scope.timer);
        };



        // request data
        $scope.getNewData = function () {
            var url = "" + $scope.url + ++$scope.counter;
            console.log('fetching: ' + url);
            $http.get(url)
                // callback to handle response and adding row
                .then(function(response){
                    console.log('response callback called.');
                    $scope.obj = response.data;	// set the context
                    console.log('new-obj[\'id\']: ' + $scope.obj['id']);

                    if ($scope.firstRun){
                        console.log('last-obj not exists (firstRun)');
                        $scope.addHtmlTable();
                        $scope.firstRun = false;
                    }else{
                        console.log('last-obj[\'id\']: ' + $scope.records[$scope.index] );
                    }

                    // if ($scope.records.length > 0 ){
                    //     console.log('last-obj[\'id\']: ' + $scope.records[$scope.index] );
                    // }else{
                    //     console.log('last-obj not exists');
                    // }

                    $scope.addRow();  // add to html view

                    //add obj and inc the index
                    $scope.index ++ ;
                    $scope.records.push($scope.obj);
                    console.log('obj pushed to array, at index: ' + $scope.index);
                    //console.log($scope.obj);
                    //console.log($scope.records[$scope.index]);
                });
        };

        // returns HTML table

        $scope.addHtmlTable = function(){
            //  <table id="table" class="table" border="1">
            //    <tr class="t_row">
            //      <th class="t_header"></th>
            //    <tr id="t_row"></tr>
            //  </table>

            // get the root element in HTML to add this child
            var table_placeholder = document.getElementById("table_placeholder");

            var table = document.createElement("TABLE");
            table.className = "table";
            table.border="1";
            table.id="obj_table";

            var tr = document.createElement("TR");
            tr.className="t_row_header";
            table.appendChild(tr);

            // add TH with key names from boject
            for (var key in $scope.obj){
                var th = document.createElement("TH");
                th.innerHTML = key;
                th.className="t_header";
                tr.appendChild(th);
            }

            table_placeholder.appendChild(table);

        };

        // generate <tr> <td></td> ... <td></td> </tr>
        $scope.addRow = function(){
            var new_tr = document.createElement("TR");
            angular.forEach($scope.obj, function(value, key) {
                var td_node = document.createElement("TD");
                td_node.innerHTML = value;
                //highlight cell if changed from last obj

                console.log("index=" + $scope.index);
                if ($scope.index >= 0) {
                    console.log("comparing old " + key + ". OLD=" + $scope.records[$scope.index][key] + ". NEW=" + $scope.obj[key]);
                    if ($scope.records[$scope.index][key] != value) {
                        td_node.style.backgroundColor = "yellow";
                    }
                }
                console.log("key: "+key+", val: "+value);
                new_tr.appendChild(td_node)
            });
            // add to table
            //var t_main = document.getElementById("t_main");
            //t_main.appendChild(new_tr);
            var obj_table = document.getElementById("obj_table");
            obj_table.appendChild(new_tr);
        };

        // $scope.getTableHeader = function(){
        //     // todo
        // };
        //
        // $scope.select = function(){
        //     this.setSelectionRange(0, this.value.length);
        // }

        // function to dump all objects array to new browser tab
        $scope.dump = function(){
            var data = "";
            for (var i = 0; i < $scope.records.length ; i++) {
                var str = JSON.stringify($scope.records[i], null, 2); // spacing level = 2
                data += str;
            }
            console.log(data);
        };

        // $scope.transform = function(){
        //     // var adder = new Function("a", "b", "return a + b");
        //
        // };

    });
