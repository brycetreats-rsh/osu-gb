// create year list and color list
const years = new Array(
    "1938",
    "1939",
    "1940",
    "1941",
    "1947",
    "1948",
    "1949",
    "1950",
    "1951",
    "1952",
    "1953",
    "1954",
    "1955",
    "1956",
    "1957",
    "1959",
    "1960",
    "1961",
    "1962",
    "1963"
);

const estabID = new Array(

);

const colors = new Array("#faffff","#60d0fa","#00a8fd","#0081e0","#007bff");

function getColor(d) {
    return d > 207
      ? colors[4]
      : d > 30
      ? colors[3]
      : d > 20
      ? colors[2]
      : d > 10
      ? colors[1]
      : colors[0];
  }

var sliderWidth = 950;
var sliderHeight = 40;

let gbCounts = "https://raw.githubusercontent.com/brycetreats-rsh/osu_greenbook_filehost/main/county_gb_counts_allyears.json"
let countyGeoFile = "https://raw.githubusercontent.com/brycetreats-rsh/osu_greenbook_filehost/main/usa_counties_full_topo.json"

let gbCountsData
let countyGeoData


d3.json(gbCounts).then(
    (data, error) => {
        if(error) {
            console.log(error);
        } else {
            // if no error, load data
            gbCountsData = data;
            console.log(gbCountsData)

            // load map after data is loaded
            d3.json(countyGeoFile).then(
                (data, error) => {
                    if(error) {
                        console.log(error);
                    } else {
                        // if no error, load data
                        countyGeoData = data
                        console.log(countyGeoData);

                        // -- create map svg -- //
                        margin = { top: 20, right: 20, bottom: 20, left: 20 };

                        // -- TIME SLIDER -- //
                        const timeSlider = d3.select('#slider').selectAll('svg');

                        var yearDomain = [0, years.length - 1];

                        // var timeSliderScale = d3.scaleThreshold()
                        //     .domain(yearDomain)
                        //     .range(0, sliderWidth)

                        const lineX1 = 50, lineX2 = 850, lineY = 21;

                        // append line to svg
                        timeSlider.append("line")
                                    .attr("x1", lineX1)
                                    .attr("x2", lineX2)
                                    .attr("y1", lineY)
                                    .attr("y2", lineY)
                                    .attr("stroke", "black")
                                    .attr("stroke-width", 2);

                        // Initial square position
                        const squareSize = 20;
                        let squareX = lineX1;

                        // append square to svg
                        const square = timeSlider.append("rect")
                                    .attr("x", squareX - squareSize / 2) // Center the square on the line
                                    .attr("y", lineY - squareSize / 2)  // Center vertically around the line
                                    .attr("width", squareSize)
                                    .attr("height", squareSize)
                                    .attr("fill", "cyan")
                                    .attr("class", "draggable");

                        const drag = d3.drag()
                        .on("drag", (event) => {
                            // Constrain x to the line's range
                            let newX = Math.max(lineX1, Math.min(lineX2, event.x));

                            // Update square position
                            square.attr("x", newX - squareSize / 2); //I need to update square position based on years list
                        });

                        // Apply drag behavior to the square
                        square.call(drag);

                        // update map features
                        function updateMap(mapIndex) {
                            
                        }
                        

                        // var colorScale = d3.scaleThreshold()
                        // .domain(yearDomain)
                        // .range(colors)

                        // -- TOOLTIP -- //
                        var tooltip = d3
                        .select("body") //check select from "body" to "#map-tooltip" to style a non-popup tooltip
                        .append("div")
                        .attr("id", "map-tooltip")
                        .style("visibility", "hidden")
                        .style("opacity", 0)
                        

                        // -- MAP -- //
                        const map = d3
                            .select("#map")
                            .append("svg")

                            //convert topojson to geojson woth d3.topo.json.features
                        var geojson = topojson.feature(countyGeoData, countyGeoData.objects.counties);
                        console.log(geojson);
                        
                        // create a path generator
                        var path = d3.geoPath();

                        map
                            .selectAll("path")
                            .data(geojson.features)
                            .enter()
                            .append("path")
                            .attr("d", path)
                            .attr("stroke", "#333")
                            .attr("class", "county")
                            //fill color based on education scale
                            .attr("fill", (d, i) => {
                                //get ID of current data element
                                let currentID = d.id;
                                // console.log(i, currentID)
                                //find education that matches id
                                let county = gbCountsData.find((item) => {
                                    if (item.fips === currentID) {
                                        // console.log(item.state)
                                        return item;
                                    } 
                                })
                                
                                return getColor(county.Y1938);
                            })
                            //add data values
                            .attr("data-fips", (d) => d.id)
                            .attr("data-gbShops", (d) => {
                                //get ID of current data element
                                let currentID = d.id;
                                // console.log(i, currentID)
                                //find education that matches id
                                let county = gbCountsData.find((item) => {
                                    if (item.fips === currentID) {
                                        // console.log(item.state)
                                        return item;
                                    } 
                                })
                                let gbShopCount = county.Y1960
                                return gbShopCount
                            })

                            //CREATE TOOLTIP
                            .on("mouseover", (event, d) => {
                                tooltip
                                    .transition()
                                    .style("visibility", "visible")
                                    .style("opacity", 1)
                                
                            })

                            .on("mousemove", (event, d) => {
                                //get ID of current data element
                                let currentID = d.id;
                                let county = gbCountsData.find((item) => {
                                    if (item.fips === currentID) {
                                        // console.log(item.state)
                                        return item;
                                    } 
                                })

                                tooltip
                                    .html("<b>Location: </b>" + county.area_name + ", " + county.state + 
                                        "<br>" +
                                        '<b>Number of Shops: </b>' + county.Y1938)
                                    .style("left", event.pageX+10 + "px")
                                    .style("top", event.pageY+10 + "px")
                            })

                            .on("mouseleave", (event, d) => {
                                tooltip
                                    .transition()
                                    .style("visibility", "hidden")
                            })

                            // CREATE A LEGEND

                            // CREATE TIMESLIDER

                            // .attr("data-education",(d, i) => {
                            //     let currentID = d.id;
                            //     // console.log(i, currentID)
                            //     //find education that matches id
                            //     let countyGeoData = countyCountsData.find((elem) => {
                            //       if (elem.fips === currentID) {
                            //         //console.log(elem.bachelorsOrHigher)
                            //         return elem;
                            //       }
                            //     })
                            //     return countyGeoData.bachelorsOrHigher
                            // })
                    }
                }
            )
        }
    }
)