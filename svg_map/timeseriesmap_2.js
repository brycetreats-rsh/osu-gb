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

const colors = new Array("#e0f7ff","#b6e2ff","#87c4ff","#5d9eff","#007bff");

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

var sliderWitdth = 950;
var sliderHeight = 380;

let gbCounts = "https://raw.githubusercontent.com/brycetreats-rsh/osu_greenbook_filehost/main/county_gb_counts_just1938.csv"
let countyGeoFile = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

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
                        console.log(countyGeoData)

                        // -- create map svg -- //
                        margin = { top: 20, right: 20, bottom: 20, left: 20 };

                        // color scale
                        var yearDomain = [0, years.length - 1];

                        var colorScale = d3.scaleThreshold()
                        .domain(yearDomain)
                        .range(colors)

                        // tooltip
                        var tooltip = d3
                        .select("#map-tooltip")
                        .append("div")
                        // .attr("class", "tooltip")
                        // .attr("id", "tooltip") // what this would do is create an ID, but I did that in the HTML
                        .style("opacity", 0);

                        //  map
                        const svg = d3
                            .select("#map")
                            .append("svg")

                            //convert topojson to geojson woth d3.topo.json.features
                        var geojson = topojson.feature(countyGeoData, countyGeoData.objects.counties);
                        console.log(geojson)
                        
                        // create a path generator
                        var path = d3.geoPath();

                        svg
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
                                
                                return colorScale(county.yearninteenthirtyeight);
                            })
                            //add data values
                            .attr("data-fips", (d) => d.id)

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