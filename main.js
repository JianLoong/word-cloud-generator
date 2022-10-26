window.onload = (event) => {
  if (window.Worker) {


    const textArea = document.getElementById("inputString");
    // const rotate = document.getElementById("inputString");
    // const fontFamily = document.getElementById("inputString");

    const button = document.getElementById("run");
    const tfIDF = document.getElementById("tfidf");
    const spiral = document.getElementById("spiral");

    const worker = new Worker("./worker.js" + '?' + Math.random());


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
        colourScheme = d3.schemeCategory10
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

      if (colourScheme == "d3.schemeDark2"){
        colourScheme = d3.schemeDark2;
      }

      if (colourScheme === "d3.schemeCategory10") {
        colourScheme = d3.schemeCategory10;
      }

      if (colourScheme === "d3.schemeTableau10"){
        colourScheme = d3.schemeTableau10;
      }

      let i = 0;
      for (let element of data) {
        element["color"] = colourScheme[ Math.floor(Math.random() * 10)]
        i++;
      }

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

    button.addEventListener("click", () => {

      const svg = d3.select("svg");
      svg.selectAll("*").remove();
      svg.remove();


      const isRemoveNumbers = document.getElementById("removeNumbers").checked;

      const isRemoveSpecialCharacters = document.getElementById("removeSpecialCharacters").checked;

      const isRemoveStopWords = document.getElementById("removeStopWords").checked;

      const selectedTransformationMethodology = document.querySelector('input[name="transformationMethodology"]:checked').value;

      const selectedFontFamily = document.getElementById("fontFamily").value;

      const selectedColourScheme = document.getElementById("colourScheme").value;

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

      const rotateFunction = () => { return ~~(Math.random() * 2) * 90; }

      worker.onmessage = (e) => {
        const data = e.data;
        const a = generateCloud(data, {
          width: 500,
          height: 500,
          fontFamily: selectedFontFamily,
          colourScheme: selectedColourScheme
        
        });


        d3.select("#cloud").node().appendChild(a);
      };
    });
  }
};
