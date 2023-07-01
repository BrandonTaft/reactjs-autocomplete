
class TrieNode {
    constructor(letter, originalIndex) {
        this.letter = letter;
        this.previousLetter = null;
        this.nextLetters = {};
        this.end = false;
        this.originalIndex = originalIndex;

        this.getWord = function () {
            let output = [];
            let node = this;
            while (node !== null) {
                output.unshift(node.letter);
                node = node.previousLetter;
            }
            const originalObject = {
                value: output.join(''),
                originalIndex: this.originalIndex
            };
            return originalObject;
        };
    };
};

export default class Trie {
    constructor() {
        var collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        this.root = new TrieNode(null);
        // inserts a word into the trie.
        this.insert = function (word, originalIndex) {
            let node = this.root;
            for (let i = 0; i < word.length; i++) {
                if (!node.nextLetters[word[i]]) {
                    node.nextLetters[word[i]] = new TrieNode(word[i]);
                    node.nextLetters[word[i]].previousLetter = node;
                }
                node = node.nextLetters[word[i]];
                if (i === word.length - 1) {
                    node.originalIndex = originalIndex;
                    node.end = true;
                }
            }
        };

        //  Return all words
        this.returnAll = () => {
            let output = [];
            findAllWords(this.root, output);
            return output.sort((a, b) => collator.compare(a.value, b.value));
        };


        // returns every word with given prefix
        this.find = function (value, showNoMatchMessage) {
            let prefix = value.toLowerCase();
            let node = this.root;
            let output = [];
            for (let i = 0; i < prefix.length; i++) {
                if (node.nextLetters[prefix[i]]) {
                    node = node.nextLetters[prefix[i]];
                } else if (node.nextLetters[prefix[i].toUpperCase()]) {
                    node = node.nextLetters[prefix[i].toUpperCase()];
                } else {
                    if (showNoMatchMessage) {
                        return (
                            [{ value: showNoMatchMessage, originalIndex: -1 }]
                        )
                    } else {
                        return output;
                    };
                };
            };
            findAllWords(node, output);
            return output.sort((a, b) => collator.compare(a.value, b.value));
        };

        // find all words in the given node.
        const findAllWords = (node, arr) => {
            if (node.end) {
                arr.unshift(node.getWord());
            };
            for (let child in node.nextLetters) {
                findAllWords(node.nextLetters[child], arr);
            };
        };

        // check if word is contained in trie.
        this.contains = function (value) {
            let word = value.toLowerCase()
            let node = this.root;
            for (let i = 0; i < word.length; i++) {
                if (node.nextLetters[word[i]]) {
                    node = node.nextLetters[word[i]];
                } else if (node.nextLetters[word[i].toUpperCase()]) {
                    node = node.nextLetters[word[i].toUpperCase()];
                } else {
                    return false;
                };
            };
            if (node.end) {
                return node.getWord();
            } else {
                return false;
            };
        };
    };
};
