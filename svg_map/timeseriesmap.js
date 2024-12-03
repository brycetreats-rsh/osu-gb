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

const colors = new Array("#e0f7ff","#b6e2ff","#87c4ff","#5d9eff","#007bff")

var map = d3.select('#map'),
        width = +map.attr("width"),
        height = +map.attr("height");

console.log(d3)
console.log(topojson)