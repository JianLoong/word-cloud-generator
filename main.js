window.onload = (event) => {
  if (window.Worker) {

    const textArea = document.getElementById("inputString");
    const button = document.getElementById("run");
    const tfIDF = document.getElementById("tfidf");
    const downloadButton = document.getElementById("download");
    const runningButton = document.getElementById("running");

    const worker = new Worker("./worker/worker.js" + '?' + Math.random());

    button.addEventListener("click", () => {

      downloadButton.classList.add("d-none");
      runningButton.classList.remove("d-none");
      button.classList.add("d-none");

      const svg = d3.select("svg");
      svg.selectAll("*").remove();
      svg.remove();

      const isRemoveNumbers = document.getElementById("removeNumbers").checked;
      const isRemoveSpecialCharacters = document.getElementById("removeSpecialCharacters").checked;
      const isRemoveStopWords = document.getElementById("removeStopWords").checked;
      const selectedTransformationMethodology = document.querySelector('input[name="transformationMethodology"]:checked').value;
      const selectedFontFamily = document.getElementById("fontFamily").value;
      const selectedFontScale = document.getElementById("fontScale").value;
      const selectedColourScheme = document.getElementById("colourScheme").value;
      const noOfOrientation = document.getElementById("noOfOrientations").value;
      const startAngle = document.getElementById("startAngle").value;
      const endAngle = document.getElementById("endAngle").value;
      
      const selectedSpiral = document.querySelector('input[name="spiral"]:checked').value;

      if (textArea == undefined || textArea.value.length == 0)
        return;

      let words = textArea.value.toLowerCase();

      const config = {
        isRemoveNumbers: isRemoveNumbers,
        isRemoveSpecialCharacters: isRemoveSpecialCharacters,
        isRemoveStopWords: isRemoveStopWords,
        selectedTransformationMethodology: selectedTransformationMethodology
      }

      worker.postMessage([words, config]);

      // https://stackoverflow.com/questions/49285933/create-rotations-from-60-to-60-in-d3-cloud
      const rotateFunction = () => { return ~~(Math.random() * noOfOrientation) * endAngle - startAngle; };

      worker.onmessage = (e) => {
        const data = e.data;
        const a = generateCloud(data, {
          width: 500,
          height: 400,
          fontFamily: selectedFontFamily,
          colourScheme: selectedColourScheme,
          fontScale: selectedFontScale,
          rotate: rotateFunction,
          spiral: selectedSpiral

        });

        d3.select("#cloud").node().appendChild(a);

        downloadButton.classList.remove("d-none");
        button.classList.remove("d-none");
        runningButton.classList.add("d-none");
        
      };
    });

    downloadButton.addEventListener("click", () => {
      d3ToPng('svg', 'word-cloud', {
        background: "white"
      });
    })
  }
};

const getColourSchemeDomain = (colourSchemeString, data) => {
  let colors = undefined;
  let isSequential = false;
  switch (colourSchemeString) {
    // Scale ordinal
    case "d3.schemeCategory10": colors = d3.scaleOrdinal(d3.schemeCategory10).domain(data); break;
    case "d3.schemeDark2": colors = d3.scaleOrdinal(d3.schemeDark2).domain(data); break;
    case "d3.schemeTableau10": colors = colors = d3.scaleOrdinal(d3.schemeTableau10).domain(data); break;
    case "d3.schemePastel1": colors = d3.scaleOrdinal(d3.schemePastel1).domain(data); break;

    // Scale sequential
    case "d3.interpolateBlues": colors = d3.scaleSequential(d3.interpolateBlues).domain([0, data.length]);
      isSequential = true;
      break;
    case "d3.interpolateGreens": colors = d3.scaleSequential(d3.interpolateGreens).domain([0, data.length]);
      isSequential = true;
      break;
    default: return data;
  }

  let i = data.length - 1;
  for (let element of data) {
    if (isSequential == false)
      element["color"] = colors(data[i]);
    else {
      element["color"] = colors(i);
    }
    i--;
  }
  return data;
}

const validations = () => {
  const textArea = document.getElementById("inputString");



}

const generateCloud = (
  text,
  {
    size = (group) => group.length, // Given a grouping of words, returns the size factor for that word
    word = (d) => d, // Given an item of the data array, returns the word
    marginTop = 0, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 0, // bottom margin, in pixels
    marginLeft = 0, // left margin, in pixels
    width = undefined, // outer width, in pixels
    height = undefined, // outer height, in pixels
    maxWords = 250, // maximum number of words to extract from the text
    fontFamily = "sans-serif", // font family
    fontScale = 15, // base font size
    padding = 0, // amount of padding between the words (in pixels)
    rotate = 0, // a constant or function to rotate the words
    invalidation, // when this promise resolves, stop the simulation
    colourScheme = "d3.schemeCategory10",
    spiral = archimedeanSpiral
  } = {}
) => {
  const words =
    typeof text === "string" ? text.split(/\W+/g) : Array.from(text);
  const data = d3
    .rollups(words, size, (w) => w)
    .sort(([, a], [, b]) => d3.descending(a, b))
    .slice(0, maxWords)
    .map(([key, size]) => ({ text: word(key), size }));

  // This is for the colour scheme
  getColourSchemeDomain(colourScheme, data);

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("font-family", fontFamily)
    .attr("text-anchor", "middle")
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const g = svg
    .append("g")
    .attr("transform", `translate(${marginLeft},${marginTop})`);



  const cloud = d3.layout
    .cloud()
    .size([
      width - marginLeft - marginRight,
      height - marginTop - marginBottom,
    ])
    .words(data)
    .spiral(spiral)
    .padding(padding)
    .rotate(rotate)
    .font(fontFamily)
    .fontSize((d) => Math.sqrt(d.size) * fontScale)
    .on("word", ({ size, x, y, rotate, text, color }) => {
      g.append("text")
        .transition()
        .duration(500)
        .style("fill", color)
        .attr("font-size", size)
        .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
        .text(text);
    });

  cloud.start();

  return svg.node();
};
