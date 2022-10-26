importScripts("./stopwords.js")
importScripts("./PorterStemmer1980.js");

// Stop word list - https://kavita-ganesan.com/what-are-stop-words/
let words = "";

function removeStopWords(str) {
  let res = []
  let words = str.split(' ')
  for (i = 0; i < words.length; i++) {
    word_clean = words[i].split(".").join("")
    if (!stopWords.includes(word_clean)) {
      res.push(word_clean)
    }
  }
  return (res.join(' '))
}

const cleanData = (words, {
  isRemoveStopWords = false,
  isRemoveNumbers = false,
  isRemoveSpecialCharacters = true,
} = {}) => {

  // Remove new lines
  words = words.replace(/(\r\n|\n|\r)/gm, "");

  if (isRemoveStopWords == true)
    words = removeStopWords(words);

  if (isRemoveNumbers == true)
    words = words.replace(/[0-9]/g, ' ');

  if (isRemoveSpecialCharacters == true) {
    words = words.replace(/[^a-zA-Z0-9 ]/g, ' ');
  }

  return words;
}


const transformData = (words, {
  selectedTransformationMethodology = undefined
} = {}) => {

  if (selectedTransformationMethodology == undefined)
    return words;

  if (selectedTransformationMethodology == "stemming") {

  

    let result = [];
    for (let word of words.split(" ")) {
      const stemmed = stemmer(word);

      result.push(stemmed);
    }

    return result.join(' ');
    
  } else
    return words;
}

onmessage = (e) => {

  const processedData = cleanData(e.data[0], e.data[1]);

  const transformedData = transformData(processedData, e.data[1]);

  postMessage(transformedData);
}