import { stopWords } from "../wrangling/stopwords";
import { stemmer } from "../wrangling/PorterStemmer1980";
import lemmatizer from 'node-lemmatizer';

const cleanData = (
  words,
  {
    isRemoveStopWords = false,
    isRemoveNumbers = false,
    isRemoveSpecialCharacters = false,
  } = {}
) => {
  // Remove new lines

  words = words.replace(/(\r\n|\n|\r)/gm, " ");
  if (isRemoveStopWords == true) words = removeStopWords(words);
  if (isRemoveNumbers == true) words = words.replace(/[0-9]/g, " ");
  if (isRemoveSpecialCharacters == true) words = words.replace(/[^a-zA-Z0-9 ]/g, " ");

  return words;
};

const transformData = (
  words,
  { selectedTransformationMethodology = undefined } = {}
) => {

  switch (selectedTransformationMethodology) {
    case "lemmatization": words = lemmatization(words); break;
    case "stemming": words = stemming(words); break;
    default: break
  }
  return words;
};

const removeStopWords = (str) => {
  let stopWordsSet = new Set(stopWords);
  let words = str.split(" ");
  words = words.filter((word) => { return !stopWordsSet.has(word) });
  return words.join(" ");
};

const stemming = (words) => {
  const res = [];
  for (let word of words.split(" ")) res.push(stemmer()(word));
  return res.join(" ");
}

const lemmatization = (str) => {
  let words = str.split(" ");
  const res = [];
  for (let word of words) res.push(lemmatizer.only_lemmas(word)[0]);
  return res.join(" ");
};

onmessage = (e) => {
  const processedData = cleanData(e.data[0], e.data[1]);
  const transformedData = transformData(processedData, e.data[1]);

  postMessage(transformedData);
};
