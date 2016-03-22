/**
 * Created by SaikrishnaTeja on 3/22/16.
 */

function loadDataSources(){
    var user = atob(document.getElementsByClassName('user')[0].value);
    var acces = atob(document.getElementsByClassName('acces')[0].value);
    var URL = "https://service.datadirectcloud.com/api/mgmt/datasources";
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        parseResponse(httpRequest)
    }
    httpRequest.open("GET", URL, true);
    httpRequest.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + acces));
    httpRequest.send(null);

}



function parseResponse(httpRequest){
    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {

            var json = httpRequest.responseText;
            var json_object = jQuery.parseJSON(json);

            for(var i =0; i < json_object.dataSources.length ; i++)
            {
                var dataSource = json_object.dataSources[i];
                $('.drpdwnDataSource')
                    .append($("<option></option>")
                        .attr("value",dataSource.dataStore)
                        .attr("id", dataSource.id)
                        .text(dataSource.name));
            }


        }
    }
}


function loadTables(){
    var user = atob(document.getElementsByClassName('user')[0].value);
    var acces = atob(document.getElementsByClassName('acces')[0].value);
    var datasource = $(".drpdwnDataSource option:selected").text();
    var URL = "https://service.datadirectcloud.com/api/odata/" + datasource;
    var httprequest = new XMLHttpRequest();
    httprequest.onreadystatechange = function () {
        parseTablesResponse(httprequest)
    }
    httprequest.open("GET", URL, true);
    httprequest.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + acces));
    httprequest.send(null);
}

function parseTablesResponse(httpRequest) {

    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {
            //alert("The response was: " + httpRequest.status + httpRequest.responseText);
            $(".drpdwntables").css('visibility', 'visible');
            $(".drpdwntables").animate({
                opacity: 'toggle'
            }, 1000);

            var xml = httpRequest.responseText,
                xmlDoc = $.parseXML(xml),
                $xml = $(xmlDoc),
                $title = $xml.find("title").each(function (index, item) {
                    $(".drpdwntables").append($('<option>', {
                        value: $(this).text(),
                        text: $(this).text()
                    }));
                });
            $("#authResults").fadeIn('slow');

        }
    }
}