/**
 * Created by SaikrishnaTeja on 3/23/16.
 */

function loadMetaData() {
    var user = atob(document.getElementsByClassName('user')[0].value);
    var acces = atob(document.getElementsByClassName('acces')[0].value);
    var datasource = atob(document.getElementsByClassName('datasource')[0].value);
    var table = atob(document.getElementsByClassName('table')[0].value);

    var URL = "https://service.datadirectcloud.com/api/odata/salesforce1/$metadata";
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        parseMetaData(httpRequest, table)
    }
    httpRequest.open("GET", URL, true);
    httpRequest.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + acces));
    httpRequest.send(null);
}


function parseMetaData(httpRequest, table){
    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {


            var xml = httpRequest.responseText,
                xmlDoc = $.parseXML(xml),
                $xml = $(xmlDoc),
                $title = $xml.find("EntityType").each(function (index, item) {
                    if(this.attributes[0].nodeValue == table)
                    {
                        for(var property in this.childNodes)
                        {

                        }
                    }
                });

        }
    }
}