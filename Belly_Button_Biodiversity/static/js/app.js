function buildMetadata(sample) {

  var url = `/metadata/${sample}`

  var sample_metadata = d3.select("#sample-metadata")

  sample_metadata.html("")
  
  d3.json(url).then(data=> {
    Object.entries(data).forEach(([key, value])=> {
      var p = sample_metadata.append("p")
      p.text(`${key}: ${value}`)
    })
  })
}

function buildCharts(sample) {

  var url = `/samples/${sample}`

  //// ***Pie Chart***
  d3.json(url).then(data=> {
    var trace1 = {
      "values": data.sample_values.slice(0,10),
      "labels": data.otu_ids.slice(0,10),
      'hovertext': data.otu_labels,
      "type": "pie"
    }
    Plotly.newPlot("pie", [trace1])

    //// ***BubbleChart***
    var trace2 = {
      "x": data.otu_ids,
      "y": data.sample_values,
      "mode": "markers",
      "marker": {
        "size": data.sample_values,
        "color": data.otu_ids
      },
      "text": data.otu_lables,
      "type": "bubble"
    }
    Plotly.newPlot("bubble", [trace2])
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
