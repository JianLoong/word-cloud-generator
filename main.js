window.onload = (event) => {

    const textArea = document.getElementById("inputString");
    const rotate = document.getElementById("inputString");
    const fontFamily = document.getElementById("inputString");
    const button = document.getElementById("run");

    let words = "";

    const stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']

    function removeStopWords(str) {
        res = []
        words = str.split(' ')
        for (i = 0; i < words.length; i++) {
            word_clean = words[i].split(".").join("")
            if (!stopwords.includes(word_clean)) {
                res.push(word_clean)
            }
        }
        return (res)
    }

    const generateCloud = (text, {
        size = group => group.length, // Given a grouping of words, returns the size factor for that word
        word = d => d, // Given an item of the data array, returns the word
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
        invalidation // when this promise resolves, stop the simulation
    } = {}) => {
        const words = typeof text === "string" ? text.split(/\W+/g) : Array.from(text);

        const data = d3.rollups(words, size, w => w)
            .sort(([, a], [, b]) => d3.descending(a, b))
            .slice(0, maxWords)
            .map(([key, size]) => ({ text: word(key), size }));

        console.log(data);

        const svg = d3.create("svg")

            .attr("viewBox", [0, 0, width, height])
          
            .attr("font-family", fontFamily)
            .attr("text-anchor", "middle")
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        const g = svg.append("g")
                .attr("transform", `translate(${marginLeft},${marginTop})`);

        const cloud = d3.layout.cloud()
            .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
            .words(data)
            .padding(padding)
            .rotate(rotate)
            .font(fontFamily)
            .fontSize(d => Math.sqrt(d.size) * fontScale)
            .on("word", ({ size, x, y, rotate, text }) => {
                g.append("text")
                    .transition()
                    .duration(500)
                    .attr("font-size", size)
                    .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
                    .text(text);
            });

        cloud.start();

        return svg.node();
    }

    button.addEventListener('click', () => {
        let words = textArea.value.toLowerCase();

        words = removeStopWords(words);

        const a = generateCloud(words, {
            width: 500,
            height: 500
        })


        d3.select("svg").remove()
        d3.select("#cloud").node().appendChild(a);

    })
}

