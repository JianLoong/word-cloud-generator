# Demo

Found [here](https://jian.sh/word-cloud-generator)


# Word Cloud Generator

"Word clouds (also known as text clouds or tag clouds) work in a simple way: the more a specific word appears in a source of textual data (such as a speech, blog post, or database), the bigger and bolder it appears in the word cloud.

A word cloud is a collection, or cluster, of words depicted in different sizes. The bigger and bolder the word appears, the more often it’s mentioned within a given text and the more important it is." as mentioned by Bootlabs.

This project is an open-source word cloud generator that uses the [d3](https://d3js.org/) library and the works of Jason Davies found [here](https://github.com/jasondavies/d3-cloud).

# What this project is 

This project is a simple word cloud generator so it is easier to generate word clouds based on certain requirements.

More interestingly most of the word cloud generators out there are too tedious to use with their configuration as well as limited options in terms of data cleaning and transformation. This project aims to be

- easy to use for a person with no programming knowledge
- providing simple data transformation and cleaning based on known ways

#  Stop words

For more information, please read the Wikipedia entry [here](https://en.wikipedia.org/wiki/Stop_word)

Plans are in place to implement, 3 published stop words lists. 
- The Snowball list is found [here](http://snowball.tartarus.org/algorithms/english/stop.txt)
- The Terrier list is found [here](https://github.com/kavgan/stop-words/blob/master/terrier-stop.txt)
- The Minimal list is found [here](https://github.com/kavgan/stop-words/blob/master/minimal-stop.txt)
- Custom list from the user
  
Depending on interest, this list will be expanded over time.

# Stemming and Lemmatization

Plans are in place to implement 2 stemming methodologies
- Porter Stemming found [here](https://tartarus.org/martin/PorterStemmer/)
- Lancaster Stemming found [here](https://www.nltk.org/_modules/nltk/stem/lancaster.html)

Lemmatization will also be implemented based on the WordNet found [here](https://wordnet.princeton.edu/)

# Contribution

Feel free to open an issue for discussion or a contribution to this repository. It is hosted via ``gh-pages``

Suggestions for the project are also welcomed but I aim to keep the project as minimalistic as possible without the need for too many external dependencies and libraries.

Remember to use a ``feature`` branch for all PRs

1) Fork this project. Then ``clone`` in your local system
2) Then create your own branch ``git checkout -b feature``
3) Remember to install npm dependencies via ``npm install``
4) To run the project just do ``npm run build``

If you see an **error** during the npm install, please delete the LICENSE and README files under the node-lemmatizer under the node_modules directory 



