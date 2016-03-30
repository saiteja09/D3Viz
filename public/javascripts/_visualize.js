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
    var measure = $(".drpdwnmeasures option:selected")[0];
    var dimension = $(".drpdwndimensions option:selected")[0];


    if(measure == undefined || dimension == undefined)
    {
        sweetAlert("Oops...", "You have to select one measure and one dimension to create a bar chart!", "error");
        return
    }

    measure = measure.value;
    dimension = dimension.value;

    var user = atob(document.getElementsByClassName('user')[0].value);
    var acces = atob(document.getElementsByClassName('acces')[0].value);
    var datasource = atob(document.getElementsByClassName('datasource')[0].value);
    var table = atob(document.getElementsByClassName('table')[0].value);
    table = pluralize(table);

    var URL = "https://service.datadirectcloud.com/api/odata/" + datasource + "/" + table + "?$format=json&$orderby=" + measure;
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
    var dataHash = new Object();
    if (httpRequest.readyState == 4) {
        if (httpRequest.status == 200) {
            var json = httpRequest.responseText;
            var json_object = jQuery.parseJSON(json);
            var array_results = json_object.d.results;
            for(var i = 0; i < array_results.length; i++)
            {
                var column_name = array_results[i][dimension];
                var column_data = array_results[i][measure];

                if(!(column_name in dataHash)) {
                    dataHash[column_name] = column_data;
                }
                else {
                    var measure_temp = dataHash[column_name];
                    dataHash[column_name] = measure_temp + column_data;
                }
            }

            drawBarGraph(dataHash);
        }
    }
}

function drawBarGraph(dataHash){

    var height = 400,
         width = 720,
       barWidth = 40,
      barOffset = 20;

    var margin = {top: 30, right: 10, bottom: 30, left: 60}

    var chartdata = new Array();
    var key_data = new Array();
    Object.keys(dataHash).forEach(function (key) {
        //if(dataHash[key] != null)
            if(dataHash[key] == null)
            {
                chartdata.push(0);
            }
            else {
                chartdata.push(dataHash[key]);
            }
            key_data.push(key);
        // iteration code
    });

    chartdata =chartdata.sort(CompareForSort);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(chartdata)])
        .range([0, height])

    var xScale = d3.scale.ordinal()
        .domain(d3.range(0, chartdata.length))
        .rangeBands([0, width])

    var x = d3.scale.ordinal()
        .domain(key_data)
        .rangePoints([0, width]);

    var colors = d3.scale.linear()
        .domain([0, chartdata.length*.33, chartdata.length*.66, chartdata.length])
        .range(['#d6e9c6', '#bce8f1', '#faebcc', '#ebccd1'])

    var awesome = d3.select('.rightbar').append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#bce8f1')
        .selectAll('rect').data(chartdata)
        .enter().append('rect')
        .style({
            'fill': function (data, i) {
                return colors(i);
            }, 'stroke': '#31708f', 'stroke-width': '5'
        })
        .attr('width', xScale.rangeBand())
        .attr('x', function (data, i) {
            return xScale(i);
        })
        .attr('height', 0)
        .attr('y', height)
        .on('mouseover', function (data) {
            dynamicColor = this.style.fill;
            d3.select(this)
                .style('fill', '#3c763d')
        })

        .on('mouseout', function (data) {
            d3.select(this)
                .style('fill', dynamicColor)
        })

    awesome.transition()
        .attr('height', function (data) {
            return yScale(data);
        })
        .attr('y', function (data) {
            return height - yScale(data);
        })
        .delay(function (data, i) {
            return i * 20;
        })
        .duration(2000)
        .ease('elastic');

    var verticalGuideScale = d3.scale.linear()
        .domain([0, d3.max(chartdata)])
        .range([height, 0])

    var vAxis = d3.svg.axis()
        .scale(verticalGuideScale)
        .orient('left')
        .ticks(chartdata.size)

    var verticalGuide = d3.select('svg').append('g')
    vAxis(verticalGuide)
    verticalGuide.attr('transform', 'translate(' + margin.left + ', 0)')
    verticalGuide.selectAll('path')
        .style({fill: 'none', stroke: "#3c763d"})
    verticalGuide.selectAll('line')
        .style({stroke: "#3c763d"})



    var hAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(key_data.size)

    var horizontalGuide = d3.select('svg').append('g')
    hAxis(horizontalGuide)
    horizontalGuide.attr('transform', 'translate(' + margin.left + ', ' + (height) + ')')
    horizontalGuide.selectAll('path')
        .style({fill: 'none', stroke: "#3c763d"})
    horizontalGuide.selectAll('line')
        .style({stroke: "#3c763d"});
    horizontalGuide.selectAll("text")
        .style("text-anchor","end").attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("y", "30")
        .attr("transform", function (d) {
            return "rotate(-90)";
        });

    $('svg')[0].attributes[1].value = 700;

}

function CompareForSort(first, second)
{
    if (first == second)
        return 0;
    if (first < second)
        return -1;
    else
        return 1;
}


