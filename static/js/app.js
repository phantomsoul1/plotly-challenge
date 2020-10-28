var url = DATA_URL;
var metadata = null;
var names = null;
var samples = null;

d3.json(url).then(dataLoaded);

// Define event handlers here

function bodyLoaded() {
    console.log("Body loaded.");
}

function dataLoaded(data) {
    //console.log(data);

    metadata = data["metadata"];
    names = data["names"];
    samples = data["samples"];

    console.log(metadata[0]);
    //console.log(names[0]);
    console.log(samples[0]);

    // populate SubjectID dropdrown
    var sel = d3.select("#selDataset");
    names.sort(compareNumericWords)
        .forEach(name => sel
            .insert("option")
            .attr("value", name)
            .html(name));
    
    // get initially selected-by-default value
    // and fire the optionChanged event with it
    // since the browser does not do it automatically
    // on loading
    var value = sel.property("value");
    optionChanged(value);
    //console.log(value);
}

function optionChanged(value) {
    //console.log(`option changed: value=${value}`);

    var metadatum = metadata.filter(d => d.id == value);
    var sample = samples.filter(d => d.id == value);

    console.log(metadatum);
    console.log(sample);
}

function compareNumericWords(w1, w2) {
    var n1 = Number(w1);
    var n2 = Number(w2);
    return n1 - n2;
}
