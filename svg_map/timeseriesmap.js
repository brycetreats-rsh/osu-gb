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

// -- GET FILES -- //
let countyCountsFile = "https://brycetreats-rsh.github.io/osu_greenbook_filehost/states_with_counts.csv"
let countyGeoFile = "https://brycetreats-rsh.github.io/osu_greenbook_filehost/usa_counties_full_geo.json"

let countyCountsData
let countyGeoData

// -- LOAD MAP -- //
let map = d3.select('#map')

let drawMap = () => {

}

// -- LOAD MAP DATA -- //
d3.csv(countyCountsFile).then(
    (data, error) => {
        if(error) {
            console.log(error);
        } else {
            // if no error, load data
            countyCountsData = data;
            console.log(countyCountsData)

            // load map after data is loaded
            d3.json(countyGeoFile).then(
                (data, error) => {
                    if(error) {
                        console.log(error);
                    } else {
                        // if no error, load data
                        countyGeoData = data;
                        console.log(countyGeoData)

                        // -- slider -- //
                        var svg = d3 // come back to this
                        .select("#slider")
                        .append("svg")
                        .attr("width", sliderWitdth)
                        .attr("height", sliderHeight);

                        var yearDomain = [0, years.length - 1];

                        var scale = d3.scaleLinear()
                        .domain(yearDomain)
                        .range(0, 930)

                        var topAxis = d3.axisTop(scale)
                        .tickFormat(function(d) {
                            return d;
                        })
                        .tickSize(0);

                        // var sliderSvg = d3.create("svg") // I believe this creates the time slider svg element, double check
                        // .call(topAxis);
                        
                        svg
                        .append("g")
                        .call(topAxis)
                        .attr("transform", "translate(" + 15 + ",0)");

                        var drag = d3.drag()
                        .origin(function() { // does not work
                            return {
                                x: d3.select(this).attr("x"), // no idea what this does yet
                                y: d3.select(this).attr("y")
                            };
                        })
                        .on("start")
                        .on("move")
                        .on("end");

                        svg
                        .append("g")
                        .append("rect")
                        .attr("class", "slideraxis")
                        .attr("width", sliderWitdth)
                        .attr("height", 7)
                        .attr("x", 0)
                        .attr("y", 16);

                        var cursor = svg
                        .append("g")
                        .attr("class", "move")
                        .append("svg")
                        .attr("x", width)
                        .attr("y", 7)
                        .attr("width", 30)
                        .attr("height", 60);
                        cursor.call(drag)
                    }
                }
            )
        }
    }
)

console.log(d3)
console.log(topojson)