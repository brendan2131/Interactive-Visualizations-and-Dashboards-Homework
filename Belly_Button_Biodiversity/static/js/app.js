function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  
  // Use `d3.json` to fetch the metadata for a sample
  var defaultURL = `/metadata/${sample}`;
  d3.json(defaultURL).then(function(data) {
    
  
    // Use d3 to select the panel with id of `#sample-metadata`
    var selectData = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    selectData.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(function ([key, value]) {
      console.log(`Key: ${key} and Value ${value}`);
      selectData.append("p").text(`${key}: ${value}`);
    });
  });
};

function buildCharts(sample) {

//   // @TODO: Use `d3.json` to fetch the sample data for the plots
var sampleURL = `/samples/${sample}`;
d3.json(sampleURL).then(function(data){
//     // @TODO: Build a Bubble Chart using the sample data
var bubbleData = [{
  mode: 'markers',
  x: data.otu_ids,
  y: data.sample_values,
  text: data.otu_labels,
  marker: {color: data.otu_ids, size: data.sample_values}
}];

var layout = {
  showlegend: false,
  height: 600,
  width: 1200
};

Plotly.newPlot('bubble', bubbleData, layout);
//     // @TODO: Build a Pie Chart
//     // HINT: You will need to use slice() to grab the top 10 sample_values,
//     // otu_ids, and labels (10 each).
// }
var topTen = data.otu_ids.slice(0,10);
var topLabel = data.otu_labels.slice(0,10);
var topSample = data.sample_values.slice(0,10);

var pieData = [{
  values: topTen,
  labels: topSample,
  hovertext: topLabel,
  type: "pie"
}];

var layout = {
  height: 600,
  width: 800,
  showledgend: true,
  legend: {
    x:1,
    y:1
  }
};

Plotly.newPlot('pie', pieData, layout);
});
};


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

