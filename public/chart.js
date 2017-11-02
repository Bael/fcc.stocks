function buildGraph(sizes, initialData) {


    let chartData = initialData || [];
    console.log(initialData);

    // define our chart object
    let chart = {
        chartData
    };

    // Set the dimensions of the canvas / graph
    let margin = sizes.margin;
    let width = sizes.width - margin.left - margin.right;
    let height = sizes.height - margin.top - margin.bottom;
    
    let xScale = d3.time.scale().range([0, width]);
    let yScale = d3.scale.linear().range([height, 0]);



    // Define the axes
    let xAxis = d3.svg.axis().scale(xScale)
        .orient("bottom").ticks(7);

    let yAxis = d3.svg.axis().scale(yScale)
        .orient("left").ticks(10);

    // Define the line
    let stocksline = d3.svg.line()
        .x(function (d) {
            return xScale(d.x);
        })
        .y(function (d) {
            return yScale(d.y);
        });

    // Adds the svg canvas
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    // splice values from all symbols + conversion
    function prepareAggregateDataValues(data) {
        return data.reduce(function (acc, currentElement) {
            return [...acc, ...currentElement.values];
        }, []).map(d => {
            return {
                x: new Date(d.x),
                y: +d.y
            }
        });

    }

    function calcDomains(data) {
        let aggregatedDataValues = prepareAggregateDataValues(data);
        xScale.domain(d3.extent(aggregatedDataValues, function (d) { return d.x; }));
        yScale.domain(d3.extent(aggregatedDataValues, function (d) { return d.y; }));

    }

    // Building chart
    calcDomains(chartData);

    var color = d3.scale.category10();

    function drawLine(d, svg) {
        svg.append("path")
        .attr("class", "line")
        .attr('id', 'line_' + d.key)
        .attr('stroke-width', 3)
        .style("stroke", function() {
            return d.color; 
        })
        .on('click', function() {
            alert(d.key);
        })
        .attr("d", stocksline(d.values));

    }
    chartData.forEach(function (d) {
        //console.log(d.key);
        d.values.forEach(value => {
            value.x = new Date(value.x)
            value.y = +value.y;
        })
        
        d.color = color(d.key);
        drawLine(d, svg);
       
    });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);



    let updateData = function (updateData) {

        calcDomains(updateData);

        svg.selectAll("path").remove();

        updateData.forEach(function (d) {
            console.log(d.key);

            d.values.forEach(value => {
                value.x = new Date(value.x)
                value.y = +value.y;
            })

            drawLine(d, svg);

            
        });


        svg.selectAll("g.y.axis")
            .call(yAxis);

        svg.selectAll("g.x.axis")
            .call(xAxis);



    }

    /// remove all data by symbol
    function removeSymbolByKey(symbolKey) {
        this.chartData = this.chartData.filter(function (obj) {
            return obj.key != symbolKey;
        });
        updateData(this.chartData)
    }

    chart.removeSymbolByKey = removeSymbolByKey;

    function addSymbol(symbolData) {
        symbolData.color = color(symbolData.key);
        this.chartData.push(symbolData);
        updateData(this.chartData);
    }

    chart.addSymbol = addSymbol;
    return chart;

}
