import {stopWords} from "../wrangling/stopwords";
import {stemmer} from "../wrangling/PorterStemmer1980"

// Stop word list - https://kavita-ganesan.com/what-are-stop-words/
let words = "";

const removeStopWords =(str) => {
  let res = []
  let words = str.split(' ')
  for (let i = 0; i < words.length; i++) {
    let cleanedWord = words[i].split(".").join("")
    if (!stopWords.includes(cleanedWord)) {
      res.push(cleanedWord)
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
  else{
    const res = [];
    for (let word of words.split(" ")){
      res.push(stemmer()(word));
    }
    return res.join( );
  }
}



export const process = (e) => {

  const processedData = cleanData(e[0], e[1]);

  const result =  transformData(processedData, e[1]);

 
  return result;
}