/**
 * Created by SaikrishnaTeja on 3/23/16.
 */

function loadMetaData() {
    var user = atob(document.getElementsByClassName('user')[0].value);
    var acces = atob(document.getElementsByClassName('acces')[0].value);
    var datasource = atob(document.getElementsByClassName('datasource')[0].value);
    var table = atob(document.getElementsByClassName('table')[0].value);

    var URL = "https://service.datadirectcloud.com/api/odata/" + datasource + "/$metadata";
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        parseMetaData(httpRequest, table)
    }
    httpRequest.open("GET", URL, true);
    httpRequest.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + acces));
    httpRequest.send(null);
}


function parseMetaData(httpRequest, table){
    var columnHash = new Object();

    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {


            var xml = httpRequest.responseText,
                xmlDoc = $.parseXML(xml),
                $xml = $(xmlDoc),
                $title = $xml.find("EntityType").each(function (index, item) {
                    if(this.attributes[0].nodeValue == table)
                    {
                        for(var i = 0; i < this.childNodes.length ; i++)
                        {
                            var property = this.childNodes[i];

                            if(property.nodeName == "Property")
                            {
                                var columnName = property.attributes[0].nodeValue;
                                var columnType = property.attributes[1].nodeValue;
                                columnHash[columnName] = columnType;

                                $(".drpdwndimensions").append($('<option>', {
                                    value: columnName,
                                    type: columnType.substring(4),
                                    text: columnName + "   ("+ columnType.substring(4) +")"
                                }));

                                if(columnType.indexOf('Int') > -1 || columnType.indexOf('Double') > -1 || columnType.indexOf('Decimal') > -1)
                                {
                                    $(".drpdwnmeasures").append($('<option>', {
                                        value: columnName,
                                        type: columnType.substring(4),
                                        text: columnName + "   (SUM)"
                                    }));
                                }

                            }
                        }
                    }
                });

        }
    }
}


function getData()
{
    var measure = $(".drpdwnmeasures option:selected").text();
    var dimension = $(".drpdwndimensions option:selected").text();

    if(measure == "" || dimension == "")
    {
        sweetAlert("Oops...", "You have to select one measure and one dimension to create a bar chart!", "error");
        return
    }
    var user = atob(document.getElementsByClassName('user')[0].value);
    var acces = atob(document.getElementsByClassName('acces')[0].value);
    var datasource = atob(document.getElementsByClassName('datasource')[0].value);
    var table = atob(document.getElementsByClassName('table')[0].value);
    table = pluralize(table);

    var URL = "https://service.datadirectcloud.com/api/odata/" + datasource + "/" + table + "?$format=json";
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        parseData(httpRequest, measure, dimension)
    }
    httpRequest.open("GET", URL, true);
    httpRequest.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + acces));
    httpRequest.send(null);

}


function parseData(httpRequest, measure, dimension)
{
    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {

            var json = httpRequest.responseText;
            var json_object = jQuery.parseJSON(json);
            var i  =0;

        }
    }
}

