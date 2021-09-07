//creating function for all the demographic info
function demoInfo(id) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        console.log(metadata);

        //filter demo info data by id
        var filterResult = metadata.filter(info => info.id.toString() === id)[0];

        var panelBody = d3.select("#sample-metadata");

        //empty the demo info panel each time before getting new data
        panelBody.html("");

        Object.entries(filterResult).forEach((key) => {
            panelBody.append("p").text(key[0] + ":" + key[1]);
        });
    });
};

//creating function for all the plots
function plots(id) {
    // getting data from the json file
    d3.json("samples.json").then((data) => {
        //console.log(data)

        //filter wfreq value by id
        var wfreq = data.metadata.filter(f => f.id.toString() === id)[0];
        wfreq = wfreq.wfreq;
        console.log("Washing Freq: " + wfreq);

        // filter samples+ values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        //console.log("Samples: " + samples);

        // Getting the top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        console.log("top 10 sample: " + samplevalues);

        // get only top 10 otu ids for the plot OTU and reversing it. 
        var OTU = (samples.otu_ids.slice(0, 10)).reverse();

        // get the otu id's to the desired form for the plot
        var OTU_id = OTU.map(d => "OTU " + d)

        console.log("OTU IDS: " + OTU_id);


        // get the top 10 labels for the plot and reversing it.
        var labels = samples.otu_labels.slice(0, 10).reverse();
        console.log("labels: " + labels);

        // create trace variable for the plot
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
                color: 'Blue'
            },
            type: "bar",
            orientation: "h",
        };

        // create data variable
        var data = [trace];

        // create layout variable to set plots layout
        var layout_bar = {
            title: "Top 10 Bacteria Cultures Found",

        };
        // create the bar plot
        Plotly.newPlot("bar", data, layout_bar);

        // The bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };

        // set the layout for the bubble plot
        var layout_b = {
            title: "Bacteria Cultures Per Sample",
            xaxis: { title: "OTU ID" },
            hovermode: "closest",
            height: 550,
            width: 1100

        };

        // creating data variable 
        var data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_b);

        // The guage chart
        var gauge_d = [
            {
                type: "indicator",
                mode: "gauge+number",
                value: wfreq,
                title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
                // title: { text: "Scrubs per Week", font: { size: 24 } },  
                gauge: {
                    axis: { range: [null, 10] },
                    bar: { color: "black" },
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "gray",
                    steps: [
                        { range: [0, 2], color: "red" },
                        { range: [2, 4], color: "orange" },
                        { range: [4, 6], color: "yellow" },
                        { range: [6, 8], color: "yellowgreen" },
                        { range: [8, 10], color: "green" }
                    ]
                }
            }
        ];


        var layout_g = {
            width: 500,
            height: 500,
            margin: { t: 20, b: 40, l: 100, r: 100 }
        };
        Plotly.newPlot("gauge", gauge_d, layout_g);
    });
}

function init() {
    //read the data
    d3.json("samples.json").then((data) => {
        //console.log(data);

        //get the name id to the dropdown menu
        data.names.forEach((name) => {
            d3.select("#selDataset")
                .append("option")
                .text(name)
                .property("value");
        });
        plots(data.names[0]);
        demoInfo(data.names[0]);
    });
};
init();

//change event function
function optionChanged(id) {
    plots(id);
    demoInfo(id);
};