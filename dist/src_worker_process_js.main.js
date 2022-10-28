/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/worker/process.js":
/*!*******************************!*\
  !*** ./src/worker/process.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _wrangling_stopwords__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../wrangling/stopwords */ \"./src/wrangling/stopwords.js\");\n/* harmony import */ var _wrangling_PorterStemmer1980__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../wrangling/PorterStemmer1980 */ \"./src/wrangling/PorterStemmer1980.js\");\n\n\n\n// Stop word list - https://kavita-ganesan.com/what-are-stop-words/\nlet words = \"\";\n\nconst removeStopWords =(str) => {\n  let res = []\n  let words = str.split(' ')\n  for (let i = 0; i < words.length; i++) {\n    let cleanedWord = words[i].split(\".\").join(\"\")\n    if (!_wrangling_stopwords__WEBPACK_IMPORTED_MODULE_0__.stopWords.includes(cleanedWord)) {\n      res.push(cleanedWord)\n    }\n  }\n  return (res.join(' '))\n}\n\nconst cleanData = (words, {\n  isRemoveStopWords = false,\n  isRemoveNumbers = false,\n  isRemoveSpecialCharacters = true,\n} = {}) => {\n\n  // Remove new lines\n  words = words.replace(/(\\r\\n|\\n|\\r)/gm, \"\");\n\n  if (isRemoveStopWords == true)\n    words = removeStopWords(words);\n\n  if (isRemoveNumbers == true)\n    words = words.replace(/[0-9]/g, ' ');\n\n  if (isRemoveSpecialCharacters == true) {\n    words = words.replace(/[^a-zA-Z0-9 ]/g, ' ');\n  }\n\n  return words;\n}\n\n\nconst transformData = (words, {\n  selectedTransformationMethodology = undefined\n} = {}) => {\n  if (selectedTransformationMethodology == undefined)\n    return words;\n  else{\n    const res = [];\n    for (let word of words.split(\" \")){\n      res.push((0,_wrangling_PorterStemmer1980__WEBPACK_IMPORTED_MODULE_1__.stemmer)()(word));\n    }\n    return res.join( );\n  }\n}\n\nonmessage = (e) => {\n\n  const processedData = cleanData(e.data[0], e.data[1]);\n\n  const transformedData = transformData(processedData, e.data[1]);\n\n  postMessage(transformedData);\n}\n\n//# sourceURL=webpack://word-cloud-generator/./src/worker/process.js?");

/***/ }),

/***/ "./src/wrangling/PorterStemmer1980.js":
/*!********************************************!*\
  !*** ./src/wrangling/PorterStemmer1980.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"stemmer\": () => (/* binding */ stemmer)\n/* harmony export */ });\n// Reference Javascript Porter Stemmer. This code corresponds to the original\n// 1980 paper available here: http://tartarus.org/martin/PorterStemmer/def.txt\n// The latest version of this code is available at https://github.com/kristopolous/Porter-Stemmer\n//\n// Original comment:\n// Porter stemmer in Javascript. Few comments, but it's easy to follow against the rules in the original\n// paper, in\n//\n//  Porter, 1980, An algorithm for suffix stripping, Program, Vol. 14,\n//  no. 3, pp 130-137,\n//\n// see also http://www.tartarus.org/~martin/PorterStemmer\n\nconst stemmer = () => {\n  var step2list = {\n      \"ational\" : \"ate\",\n      \"tional\" : \"tion\",\n      \"enci\" : \"ence\",\n      \"anci\" : \"ance\",\n      \"izer\" : \"ize\",\n      \"bli\" : \"ble\",\n      \"alli\" : \"al\",\n      \"entli\" : \"ent\",\n      \"eli\" : \"e\",\n      \"ousli\" : \"ous\",\n      \"ization\" : \"ize\",\n      \"ation\" : \"ate\",\n      \"ator\" : \"ate\",\n      \"alism\" : \"al\",\n      \"iveness\" : \"ive\",\n      \"fulness\" : \"ful\",\n      \"ousness\" : \"ous\",\n      \"aliti\" : \"al\",\n      \"iviti\" : \"ive\",\n      \"biliti\" : \"ble\",\n      \"logi\" : \"log\"\n    },\n\n    step3list = {\n      \"icate\" : \"ic\",\n      \"ative\" : \"\",\n      \"alize\" : \"al\",\n      \"iciti\" : \"ic\",\n      \"ical\" : \"ic\",\n      \"ful\" : \"\",\n      \"ness\" : \"\"\n    },\n\n    c = \"[^aeiou]\",          // consonant\n    v = \"[aeiouy]\",          // vowel\n    C = c + \"[^aeiouy]*\",    // consonant sequence\n    V = v + \"[aeiou]*\",      // vowel sequence\n\n    mgr0 = \"^(\" + C + \")?\" + V + C,               // [C]VC... is m>0\n    meq1 = \"^(\" + C + \")?\" + V + C + \"(\" + V + \")?$\",  // [C]VC[V] is m=1\n    mgr1 = \"^(\" + C + \")?\" + V + C + V + C,       // [C]VCVC... is m>1\n    s_v = \"^(\" + C + \")?\" + v;                   // vowel in stem\n\n  function dummyDebug() {}\n\n  function realDebug() {\n    console.log(Array.prototype.slice.call(arguments).join(' '));\n  }\n\n  return function (w, debug) {\n    var\n      stem,\n      suffix,\n      firstch,\n      re,\n      re2,\n      re3,\n      re4,\n      debugFunction,\n      origword = w;\n\n    if (debug) {\n      debugFunction = realDebug;\n    } else {\n      debugFunction = dummyDebug;\n    }\n\n    if (w.length < 3) { return w; }\n\n    firstch = w.substr(0,1);\n    if (firstch == \"y\") {\n      w = firstch.toUpperCase() + w.substr(1);\n    }\n\n    // Step 1a\n    re = /^(.+?)(ss|i)es$/;\n    re2 = /^(.+?)([^s])s$/;\n\n    if (re.test(w)) { \n      w = w.replace(re,\"$1$2\"); \n      debugFunction('1a',re, w);\n\n    } else if (re2.test(w)) {\n      w = w.replace(re2,\"$1$2\"); \n      debugFunction('1a',re2, w);\n    }\n\n    // Step 1b\n    re = /^(.+?)eed$/;\n    re2 = /^(.+?)(ed|ing)$/;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      re = new RegExp(mgr0);\n      if (re.test(fp[1])) {\n        re = /.$/;\n        w = w.replace(re,\"\");\n        debugFunction('1b',re, w);\n      }\n    } else if (re2.test(w)) {\n      var fp = re2.exec(w);\n      stem = fp[1];\n      re2 = new RegExp(s_v);\n      if (re2.test(stem)) {\n        w = stem;\n        debugFunction('1b', re2, w);\n\n        re2 = /(at|bl|iz)$/;\n        re3 = new RegExp(\"([^aeiouylsz])\\\\1$\");\n        re4 = new RegExp(\"^\" + C + v + \"[^aeiouwxy]$\");\n\n        if (re2.test(w)) { \n          w = w + \"e\"; \n          debugFunction('1b', re2, w);\n\n        } else if (re3.test(w)) { \n          re = /.$/; \n          w = w.replace(re,\"\"); \n          debugFunction('1b', re3, w);\n\n        } else if (re4.test(w)) { \n          w = w + \"e\"; \n          debugFunction('1b', re4, w);\n        }\n      }\n    }\n\n    // Step 1c\n    re = new RegExp(\"^(.*\" + v + \".*)y$\");\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      w = stem + \"i\";\n      debugFunction('1c', re, w);\n    }\n\n    // Step 2\n    re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      suffix = fp[2];\n      re = new RegExp(mgr0);\n      if (re.test(stem)) {\n        w = stem + step2list[suffix];\n        debugFunction('2', re, w);\n      }\n    }\n\n    // Step 3\n    re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      suffix = fp[2];\n      re = new RegExp(mgr0);\n      if (re.test(stem)) {\n        w = stem + step3list[suffix];\n        debugFunction('3', re, w);\n      }\n    }\n\n    // Step 4\n    re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;\n    re2 = /^(.+?)(s|t)(ion)$/;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      re = new RegExp(mgr1);\n      if (re.test(stem)) {\n        w = stem;\n        debugFunction('4', re, w);\n      }\n    } else if (re2.test(w)) {\n      var fp = re2.exec(w);\n      stem = fp[1] + fp[2];\n      re2 = new RegExp(mgr1);\n      if (re2.test(stem)) {\n        w = stem;\n        debugFunction('4', re2, w);\n      }\n    }\n\n    // Step 5\n    re = /^(.+?)e$/;\n    if (re.test(w)) {\n      var fp = re.exec(w);\n      stem = fp[1];\n      re = new RegExp(mgr1);\n      re2 = new RegExp(meq1);\n      re3 = new RegExp(\"^\" + C + v + \"[^aeiouwxy]$\");\n      if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {\n        w = stem;\n        debugFunction('5', re, re2, re3, w);\n      }\n    }\n\n    re = /ll$/;\n    re2 = new RegExp(mgr1);\n    if (re.test(w) && re2.test(w)) {\n      re = /.$/;\n      w = w.replace(re,\"\");\n      debugFunction('5', re, re2, w);\n    }\n\n    // and turn initial Y back to y\n    if (firstch == \"y\") {\n      w = firstch.toLowerCase() + w.substr(1);\n    }\n\n\n    return w;\n  }\n};\n\n\n//# sourceURL=webpack://word-cloud-generator/./src/wrangling/PorterStemmer1980.js?");

/***/ }),

/***/ "./src/wrangling/stopwords.js":
/*!************************************!*\
  !*** ./src/wrangling/stopwords.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"stopWords\": () => (/* binding */ stopWords)\n/* harmony export */ });\n\nconst stopWords = [\n    \"i\",\n    \"me\",\n    \"my\",\n    \"myself\",\n    \"we\",\n    \"our\",\n    \"ours\",\n    \"ourselves\",\n    \"you\",\n    \"your\",\n    \"yours\",\n    \"yourself\",\n    \"yourselves\",\n    \"he\",\n    \"him\",\n    \"his\",\n    \"himself\",\n    \"she\",\n    \"her\",\n    \"hers\",\n    \"herself\",\n    \"it\",\n    \"its\",\n    \"itself\",\n    \"they\",\n    \"them\",\n    \"their\",\n    \"theirs\",\n    \"themselves\",\n    \"what\",\n    \"which\",\n    \"who\",\n    \"whom\",\n    \"this\",\n    \"that\",\n    \"these\",\n    \"those\",\n    \"am\",\n    \"is\",\n    \"are\",\n    \"was\",\n    \"were\",\n    \"be\",\n    \"been\",\n    \"being\",\n    \"have\",\n    \"has\",\n    \"had\",\n    \"having\",\n    \"do\",\n    \"does\",\n    \"did\",\n    \"doing\",\n    \"a\",\n    \"an\",\n    \"the\",\n    \"and\",\n    \"but\",\n    \"if\",\n    \"or\",\n    \"because\",\n    \"as\",\n    \"until\",\n    \"while\",\n    \"of\",\n    \"at\",\n    \"by\",\n    \"for\",\n    \"with\",\n    \"about\",\n    \"against\",\n    \"between\",\n    \"into\",\n    \"through\",\n    \"during\",\n    \"before\",\n    \"after\",\n    \"above\",\n    \"below\",\n    \"to\",\n    \"from\",\n    \"up\",\n    \"down\",\n    \"in\",\n    \"out\",\n    \"on\",\n    \"off\",\n    \"over\",\n    \"under\",\n    \"again\",\n    \"further\",\n    \"then\",\n    \"once\",\n    \"here\",\n    \"there\",\n    \"when\",\n    \"where\",\n    \"why\",\n    \"how\",\n    \"all\",\n    \"any\",\n    \"both\",\n    \"each\",\n    \"few\",\n    \"more\",\n    \"most\",\n    \"other\",\n    \"some\",\n    \"such\",\n    \"no\",\n    \"nor\",\n    \"not\",\n    \"only\",\n    \"own\",\n    \"same\",\n    \"so\",\n    \"than\",\n    \"too\",\n    \"very\",\n    \"s\",\n    \"t\",\n    \"can\",\n    \"will\",\n    \"just\",\n    \"don\",\n    \"should\",\n    \"now\",\n  ];\n  \n\n//# sourceURL=webpack://word-cloud-generator/./src/wrangling/stopwords.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/worker/process.js");
/******/ 	
/******/ })()
;