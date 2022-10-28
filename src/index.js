import { select, create, rollups, descending, treemapResquarify } from "d3"
import *  as chromatic from "d3-scale-chromatic"
import { scaleOrdinal, scaleSequential } from "d3";
import cloud from "d3-cloud"
import * as d3ToPng from "d3-svg-to-png"

window.onload = (event) => {

  if (window.Worker) {
    const textArea = document.getElementById("inputString");
    const button = document.getElementById("run");
    const tfIDF = document.getElementById("tfidf");
    const downloadButton = document.getElementById("download");
    const runningButton = document.getElementById("running");

    const divResult = document.querySelector(".div-result");


    const worker = new Worker(new URL('./worker/process.js', import.meta.url));


    button.addEventListener("click", () => {

      const noOfOrientation = document.getElementById("noOfOrientations").value;
      const startAngle = document.getElementById("startAngle").value;
      const endAngle = document.getElementById("endAngle").value;

      if (validation()) {
        const form = document.querySelector('.needs-validation');
       
        form.classList.add("was-validated");
        // button.classList.remove("disabled");
      }
      else {
        // button.classList.add("disabled");
        const form = document.querySelector('.needs-validation');

        form.classList.add("was-validated");
        return;
      }

      divResult.classList.add("d-none");
      downloadButton.classList.add("d-none");
      runningButton.classList.remove("d-none");
      button.classList.add("d-none");

      const svg = select("svg");
      svg.selectAll("*").remove();
      svg.remove();

      const isRemoveNumbers = document.getElementById("removeNumbers").checked;
      const isRemoveSpecialCharacters = document.getElementById(
        "removeSpecialCharacters"
      ).checked;
      const isReverseColourOrdering = document.getElementById(
        "reverseColourOrdering"
      ).checked;
      const isRemoveStopWords =
        document.getElementById("removeStopWords").checked;
      const selectedTransformationMethodology = document.querySelector(
        'input[name="transformationMethodology"]:checked'
      ).value;
      const selectedFontFamily = document.getElementById("fontFamily").value;
      const selectedFontScale = document.getElementById("fontScale").value;
      const selectedColourScheme =
        document.getElementById("colourScheme").value;

      const selectedSpiral = document.querySelector(
        'input[name="spiral"]:checked'
      ).value;
      const words = textArea.value.toLowerCase();
      const config = {
        isRemoveNumbers,
        isRemoveSpecialCharacters,
        isRemoveStopWords,
        selectedTransformationMethodology,
      };

      worker.postMessage([words, config]);

      // https://stackoverflow.com/questions/49285933/create-rotations-from-60-to-60-in-d3-cloud
      const rotateFunction = () => {
        return ~~(Math.random() * noOfOrientation) * endAngle - startAngle;
      };

      worker.onmessage = (e) => {
        const data = e.data;
        const a = generateCloud(data, {
          width: 500,
          height: 400,
          fontFamily: selectedFontFamily,
          colourScheme: selectedColourScheme,
          fontScale: selectedFontScale,
          rotate: rotateFunction,
          spiral: selectedSpiral,
          isReverseColourOrdering,
        });

        select("#cloud").node().appendChild(a);

        downloadButton.classList.remove("d-none");
        button.classList.remove("d-none");
        runningButton.classList.add("d-none");
        divResult.classList.remove("d-none");
      };

    });

    downloadButton.addEventListener("click", () => {
      d3ToPng("svg", "word-cloud", {
        background: "white",
      });
    });


    const validation = () => {
      const noOfOrientation = document.getElementById("noOfOrientations").value;
      const startAngle = document.getElementById("startAngle").value;
      const endAngle = document.getElementById("endAngle").value;
      const textArea = document.getElementById("inputString").value;

      if (noOfOrientation < 0)
        return false;
      if (noOfOrientation > 10)
        return false;
      if (textArea.length === 0)
        return false;
      if (textArea === undefined)
        return false;
      return true;
    }
  }



};

const getColourSchemeDomain = (
  colourSchemeString,
  data,
  isReverseColourOrdering
) => {
  let colors;
  let isSequential = false;
  switch (colourSchemeString) {
    // Scale ordinal
    case "d3.schemeCategory10":
      colors = scaleOrdinal(chromatic.schemeCategory10).domain(data);
      break;
    case "d3.schemeDark2":
      colors = scaleOrdinal(chromatic.schemeDark2).domain(data);
      break;
    case "d3.schemeTableau10":
      colors = colors = scaleOrdinal(chromatic.schemeTableau10).domain(data);
      break;
    case "d3.schemeAccent":
      colors = colors = scaleOrdinal(chromatic.schemeAccent).domain(data);
      break;
    case "d3.schemePaired":
      colors = scaleOrdinal(chromatic.schemePaired).domain(data);
      break;
    // Scale sequential
    case "d3.interpolateBlues":
      colors = scaleSequential(chromatic.interpolateBlues).domain([0, data.length]);
      isSequential = true;
      break;
    case "d3.interpolateGreens":
      colors = scaleSequential(chromatic.interpolateGreens).domain([0, data.length]);
      isSequential = true;
      break;
    case "d3.interpolateCool":
      colors = scaleSequential(chromatic.interpolateCool).domain([0, data.length]);
      isSequential = true;
      break;
    case "d3.interpolateRdGy":
      colors = scaleSequential(chromatic.interpolateRdGy).domain([0, data.length]);
      isSequential = true;
      break;
    case "d3.interpolateCividis":
      colors = scaleSequential(chromatic.interpolateCividis)
        .domain([0, data.length]);
      isSequential = true;
      break;
    default:
      return data;
  }


  if (isReverseColourOrdering === false) {
    for (let i = 0; i < data.length; i++) {
      if (isSequential === false) data[i].color = colors(data[i]);
      else {
        data[i].color = colors(i);
      }
    }
  } else {
    let i = data.length - 1;
    for (const element of data) {
      if (isSequential === false) element.color = colors(data[i]);
      else {
        element.color = colors(i);
      }
      i--;
    }
  }
  return data;
};

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
    spiral = archimedean,
    isReverseColourOrdering = false,
  } = {}
) => {
  const words =
    typeof text === "string" ? text.split(/\W+/g) : Array.from(text);
  const data =
    rollups(words, size, (w) => w)
      .sort(([, a], [, b]) => descending(a, b))
      .slice(0, maxWords)
      .map(([key, size]) => ({ text: word(key), size }));

  // This is for the colour scheme
  getColourSchemeDomain(colourScheme, data, isReverseColourOrdering);

  const svg =
    create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("font-family", fontFamily)
      .attr("text-anchor", "middle")
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const g = svg
    .append("g")
    .attr("transform", `translate(${marginLeft},${marginTop})`);

  const c =
    cloud()
      .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
      .words(data)
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

  c.start();

  return svg.node();
}

