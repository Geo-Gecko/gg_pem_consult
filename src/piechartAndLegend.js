function addLegend(array, arrayLabel, legendLabel, legendWhere, circle) {
				d3.select(legendWhere).select('svg').remove();
				var legendSvg = d3.select(legendWhere)
				.append('svg')
				.attr('class', 'head')
				.attr('width', "100%")
				.attr('height', 100);


				var legendX = 0;
				var legendDY = 20;

				if (circle) {
					legendSvg.selectAll("circle")
						.data(array)
						.enter()
						.append("circle")
						.attr("cy",function(d, i) {
						return (i + 1) * legendDY + 10;
					})
						.attr("cx",10)
						.attr("r","0.4em")
						.style("fill",function(d, i) {
						return array[i];
					});

				}

				if (!circle) {
					legendSvg.selectAll('.legend-rect')
						.data(array)
						.enter()
						.append('rect')
						.attr('class', 'legend-rect')
						.attr("x", legendX)
						.attr("y", function (d, i) {
						return (i + 1) * legendDY;
					})
						.attr("width", 20)
						.attr("height", 20)
						.style("stroke", "black")
						.style("stroke-width", 0)
						.style("fill", function (d, i) {
						return array[i];
					});	
				}

				//the data objects are the fill colors

				legendSvg.selectAll('.legend-text')
					.data(array)
					.enter()
					.append('text')
					.attr('class', 'legend-text')
					.style('color', 'white')
					.attr("x", legendX + 25)
					.attr("y", function (d, i) {
					return (i) * legendDY + 25;
				})
					.attr("dy", "0.8em") //place text one line *below* the x,y point
					.text(function (d, i) {
					return arrayLabel[i];
				});

				legendSvg.selectAll('.legend-title')
					.data([legendLabel])
					.enter()
					.append('text')
					.attr('class', 'legend-title')
					.attr("x", legendX)
					.attr("y", 0)
					.attr("font-weight", "bold")
					.attr("dy", "0.8em") //place text one line *below* the x,y point
					.text(function (d, i) {
					return d;
				});
			}
