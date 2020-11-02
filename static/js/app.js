var url = DATA_URL;
var metadata = null;
var names = null;
var samples = null;

// Define event handlers here

function bodyLoaded() {
    d3.json(url).then(dataLoaded);
}

function dataLoaded(data) {
    //console.log(data);

    metadata = data["metadata"];
    names = data["names"];
    samples = data["samples"];

    //console.log(metadata[0]);
    //console.log(names[0]);
    //console.log(samples[0]);

    // populate SubjectID dropdrown
    var sel = d3.select("#selDataset");
    names.sort((a,b) => Number(a) - Number(b))
        .forEach(name => sel.insert("option")
            .attr("value", name)
            .html(name));
    
    // get initially selected-by-default value
    var value = sel.property("value");

    //console.log(value);

    var metadatum = metadata.filter(d => d.id == value)[0];
    var sample = samples.filter(d => d.id == value)[0];

    //console.log(`sample=${sample}`);

    displayMetadata(metadatum);

    var data = getBarChartData(sample);
    initBarChart(data);

    data = getBubbleChartData(sample);
    initBubbleChart(data);

    data = getGaugeChartData(metadatum);
    initGaugeChart(data);
}

function optionChanged(value) {
    //console.log(`option changed: value=${value}`);

    var metadatum = metadata.filter(d => d.id == value)[0];
    var sample = samples.filter(d => d.id == value)[0];

    //console.log(`sample=${sample}`);

    displayMetadata(metadatum);

    var data = getBarChartData(sample);
    initBarChart(data);

    data = getBubbleChartData(sample);
    initBubbleChart(data);

    data = getGaugeChartData(metadatum);
    initGaugeChart(data);
}

function getBarChartData(sample) {
    //console.log(`getBarChartTrace(sample=${sample})`);

    var array = [
        sample.sample_values,
        sample.otu_ids,
        sample.otu_labels
    ];
    array = sortArrays(array, compareDesc);

    var sample_values = array[0].slice(0, 10).reverse();
    var otu_ids = array[1].slice(0, 10).reverse();
    var otu_labels = array[2].slice(0, 10).reverse();

    //console.log(otu_labels);

    var trace = {
        x: sample_values,
        y: otu_ids.map(otu => `OTU ${otu}`),
        type: 'bar',
        orientation: 'h',
        text: otu_labels.map(l => l.replaceAll(';', '<br>'))
    }

    return [trace];
}

function getBubbleChartData(sample) {

    var trace = {
        x: sample.otu_ids,
        y: sample.sample_values,
        mode: 'markers',
        marker: {
            size: sample.sample_values,
            color: sample.otu_ids,
            colorscale: 'Earth'
        },
        text: sample.otu_labels.map(l => l.replaceAll(';', '<br>')),
        type: "bubble"
    };

    return [trace];
}

function getGaugeChartData(metadatum) {

    console.log(metadatum.wfreq);

    var trace = {
        // type: "pie",
        // showlegend: false,
        // hole: 0.4,
        // rotation: 90,
        // values: [100/10, 100/10, 100/10, 100/10, 100/10,100/10, 100/10, 100/10, 100/10, 100/10,100],
        // text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9','9-10',''],
        // direction: 'clockwise',
        // textinfo: 'text',
        // testposition: 'inside',
        // markers: {
        //     colorscale: 'Greens'
        // }

        type: 'indicator',
        name: 'Washes per Week',
        title: {
            text: '<b>Belly Button Washing Frequency</b>' +
                '<br>Scrubs per Week'
        },
        visible: 'false',
        mode: 'gauge',
        value: metadatum.wfreq,
        gauge: {
            bar: { thickness: 0 },
            axis: {
                range: [0, 10],
                tickmode: "array",
                tickvals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                ticktext: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9','9-10'],
                ticks: "inside"
            },
            steps: [
                { range: [0, 1], colorscale: 'Greens' },
                { range: [1, 2] },
                { range: [2, 3] },
                { range: [3, 4] },
                { range: [4, 5] },
                { range: [5, 6] },
                { range: [6, 7] },
                { range: [7, 8] },
                { range: [8, 9] },
                { range: [9, 10] }
            ]
            
        },
        colorscale: 'Greens'
    };

    return [trace];
}

function initBarChart(data) {
    var layout = {
    };

    var config = {
        displayModeBar: false,
        responsive: true
    };

    Plotly.newPlot("bar", data, layout, config);
}

function initBubbleChart(data) {
    var layout = {
        xaxis: {title: 'OTU ID'}
    };

    var config = {};

    Plotly.newPlot("bubble", data, layout, config);
}

function initGaugeChart(data) {
    var degrees = 18*data[0].value - 9, radius = 0.4;
    var radians = degrees * Math.PI / 180;
    var x = -1 * radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    var layout = {
        shapes: [{
            type: 'line',
            x0: 0.5,
            y0: 0.25,
            x1: 0.5 + x,
            y1: 0.25 + y,
            line: {
                color: 'darkred',
                width: 4
            }
        }],
        xaxis: { visible: false, range: [-1, 1] },
        yaxis: { visible: false, range: [-1, 1] }
    };

    var config = {};

    Plotly.newPlot("gauge", data, layout, config);
}

function displayMetadata(metadata) {
    var sampleMetadata = d3.select("#sample-metadata");

    sampleMetadata.html('');
    if (metadata) {
        var id = `<p>id: ${metadata.id}</p>`;
        var ethnicity = `<p>ethnicity: ${metadata.ethnicity}</p>`;
        var gender = `<p>gender: ${metadata.gender}</p>`;
        var age = `<p>age: ${metadata.age}</p>`;
        var location = `<p>location: ${metadata.location}</p>`;
        var bbtype = `<p>bbtype: ${metadata.bbtype}</p>`;
        var wfreq = `<p>wfreq: ${metadata.wfreq}</p>`;

        sampleMetadata.html(
            id +
            ethnicity +
            gender +
            age +
            location +
            bbtype +
            wfreq
        );
    }
}

function compareDesc(a, b) {
    return (a > b) ? -1 : (a < b) ? 1 : 0;
}

function sortArrays(arrays, comparator = (a,b) => (a < b) ? -1 : (a > b) ? 1 : 0) {
    var arrayKeys = Object.keys(arrays);
    var sortableArray = Object.values(arrays)[0];
    var indicies = Object.keys(sortableArray);
    var sortedIndicies = indicies.sort((a,b) => comparator(sortableArray[a], sortableArray[b]));

    var sortByIndicies = (array, sortedIndicies) => sortedIndicies.map(sortedIndex => array[sortedIndex]);

    if (Array.isArray(arrays)) {
        return arrayKeys.map(arrayIndex => sortByIndicies(arrays[arrayIndex], sortedIndicies));
    }
    else {
        var sortedArrays = {};
        arrayKeys.forEach((arrayKey) => {
            sortedArrays[arrayKey] = sortByIndicies(arrays[arrayKey], sortedIndicies);
        });
        return sortedArrays;
    }
}
