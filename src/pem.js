function filters(filterList) {

  if (filterList) {
    var _dataList = d3.select("#pem-filter-list").selectAll("p")
      .data(filterList.data);
    _dataList.enter().append("p")
      .style("width", "40%")
      .style("margin", "auto")
      .html(function (d) {
        return "<div><span>" + d["Name"] + "</span></div>";
      })
    _dataList.exit().remove();
  }

  d3.select("#pem-filter-list").selectAll("p").append("div").attr("class", "sliders");

  var sliders = document.getElementsByClassName('sliders');

  var max = d3.max(filteredDataset, function (d) {
    var value = d["Value of assignment (EUR)"].toString().replace(/,/g, '');
    return parseFloat(value);
  });
  var min = d3.min(filteredDataset, function (d) {
    var value = d["Value of assignment (EUR)"].toString().replace(/,/g, '');
    return parseFloat(value);
  });

  var Start = d3.min(filteredDataset, function (d) {
    return Date.parse(d["End year "])
  });

  var End = d3.max(filteredDataset, function (d) {
    return Date.parse(d["End year "])
  });


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

  sliders[0].noUiSlider.on('slide', function (values, handle) {
    sliderData[1].values = values;
    styleFeatures(sliderData);
  });

  noUiSlider.create(sliders[1], {
    start: [min, max],
    behaviour: "drag",
    connect: true,
    step: (max - min) / 10000,
    range: {
      'min': min,
      '70%': 400000,
      '80%': 2000000,
      'max': max
    },
    tooltips: true,
    format: {
      to: function (value) {
        return "€" + numberWithCommas(value.toFixed(0));
      },
      from: function (value) {
        return value;
      }
    }
  });

  sliderData[0].values = [min, max];

  sliders[1].noUiSlider.on('slide', function (values, handle) {
    // console.log(values)
    sliderData[0].values = [parseFloat(values[0].substr(1).toString().replace(/,/g, '')), parseFloat(values[1].substr(1).toString().replace(/,/g, ''))];
    styleFeatures(sliderData);
  });

  $('#resetSliders').click(function (d) {
    // $.each(sliders, function (index, value) {
    //   value.noUiSlider.reset();
    // })
    // resetMap();
    window.location.reload(false); 
  })

  $('#filterButton').click(function (d) {
    $.each(sliders, function (index, value) {
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
