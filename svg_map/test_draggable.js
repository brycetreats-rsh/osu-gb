// var sliderWidth = 950;
// var sliderHeight = 40;

// var svg = d3.select("#slider");

// svg.attr("class", "timeslider")
//     .append("svg")
//     .attr("width", sliderWidth)
//     .attr("height", sliderHeight)
//     .append('circle')
//     .attr('cx', 475)
//     .attr('cy', 20)
//     .attr('r', 7)
//     .style('fill', 'cyan');

// svg.selectAll("circle")
//     .data([{
//         x: 50,
//         y: 50
//     }])
//     .enter()
//     .append("circle")
//     .attr("class", "timeslider")
//     .attr("x", function (d) {
//         return (d.x)
//     })
//     .attr("y", function (d) {
//         return (d.y)
//     })
//     .attr("fill", "#039BE5")
//     .attr("stroke", "#039BE5")
//     .attr("stroke-width", "1px");

// var dragHandler = d3.drag()
//     .on("drag", function () {
//         d3.select(this)
//             .attr("x", d3.event.x)
//             .attr("y", d3.event.y);
//     });

// dragHandler(svg.selectAll("circle"));

// pointer

const timeSlider = d3.select('#slider').selectAll('svg');

// define line position
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
    square.attr("x", newX - squareSize / 2);
});

// Apply drag behavior to the square
square.call(drag);
