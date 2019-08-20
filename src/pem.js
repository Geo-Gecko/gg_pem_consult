function filters(filterList) {

  if (filterList) {
    var _dataList = d3.select("#pem-filter-list").selectAll("p")
      .data(filterList.data);
    _dataList.enter().append("p")
    .style("width", "40%")
      .html(function(d) {
        return "<div><span>" + d["Name"] + "</span></div>";
      })
    _dataList.exit().remove();
  }

  d3.select("#pem-filter-list").selectAll("p").append("div").attr("class", "sliders");

  var sliders = document.getElementsByClassName('sliders');

  var max = d3.max(filteredDataset, function(d) {
    var value = d["EUR Value of assignment"].toString().replace(/,/g, '');
    return parseFloat(value);
  });
  var min = d3.min(filteredDataset, function(d) {
    var value = d["EUR Value of assignment"].toString().replace(/,/g, '');
    return parseFloat(value);
  });

  var Start = d3.min(filteredDataset, function(d) {
    return Date.parse(d["Start Year"].toString())
  });

  var End = d3.max(filteredDataset, function(d) {
    return Date.parse(d["Start Year"].toString())
  });

  // function timestamp(str) {
  //   return new Date(str).getTime();
  // }

  // weekdays and months
  // var months = [
  //   "Jan", "Feb", "Mar",
  //   "Apr", "May", "Jun", "Jul",
  //   "Aug", "Sep", "Oct",
  //   "Nov", "Dec"
  // ];

  function formatDate(date) {
    return date.getFullYear();
  }

  // var date = new Date();

  function toFormat(v) {
    return formatDate(new Date(v));
  }


  // nouislider settings
  noUiSlider.create(sliders[0], {
    behaviour: 'drag',
    connect: true,
    tooltips: [true, true],
    format: {
      to: toFormat,
      from: Number
    },
    range: {
      min: parseFloat(Start),
      max: parseFloat(End)
    },
    step: 380 * 24 * 60 * 60 * 1000,
    start: [parseFloat(Start), parseFloat(End)]
  });

  sliderData[1].values = [toFormat(parseFloat(Start)), toFormat(parseFloat(End))];

  sliders[0].noUiSlider.on('end', function(values, handle) {
    sliderData[1].values = values;
    styleFeatures(sliderData);
  });

  noUiSlider.create(sliders[1], {
    start: [min, max],
    behaviour: "drag",
    connect: true,
    step: (max - min)/1000,
    range: {
      'min': min,
      'max': max
    },
    tooltips: true,
    format: {
      to: function(value) {
        return value.toFixed(0);
      },
      from: function(value) {
        return value;
      }
    }
  });

  sliderData[0].values = [min, max];

  sliders[1].noUiSlider.on('end', function(values, handle) {
    sliderData[0].values = values;
    styleFeatures(sliderData);
  });

  $('#resetSliders').click(function(d) {
    $.each(sliders, function(index, value) {
      value.noUiSlider.reset();
    })
    resetMap();
  })

  $('#filterButton').click(function(d) {
    $.each(sliders, function(index, value) {
      value.noUiSlider.reset();
    })
    resetMap();
  })

  function resetMap() {

    d3.select("#pem-count").text(numberWithCommas(geoJsonFeatureCollection.features.length));


    for (key in map['_layers']) {
      if (typeof map['_layers'][key]['feature'] !== 'undefined' && map['_layers'][key]['feature']['geometry']['type'] !== 'MultiPolygon') {
        var l = map['_layers'][key];
        l.setStyle({
          radius: 6,
          fillColor: "#c3ff3e",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        })
      }
    }

  }

};