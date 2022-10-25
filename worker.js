importScripts("./stopwords.js")
importScripts("./PorterStemmer1980.js")

let words = "";

const removeStopWords = (str) => {
  res = [];
  words = str.split(" ");
  for (i = 0; i < words.length; i++) {
    word_clean = words[i].split(".").join("");
    if (!stopWords.includes(word_clean)) {
      word_clean = stemmer(word_clean)
      res.push(word_clean);
    }
  }
  return res;
};


onmessage = (e) => {
    const processedData = removeStopWords(e.data);
 
    postMessage(processedData);
}