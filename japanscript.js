// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Program", "symbols": ["_", "StatementList", "_"]},
    {"name": "StatementList", "symbols": ["Statement"]},
    {"name": "StatementList", "symbols": ["StatementList", "_", "Statement"]},
    {"name": "Statement", "symbols": ["FunctionDeclaration"]},
    {"name": "Statement", "symbols": ["ReturnStatement"]},
    {"name": "Statement", "symbols": ["FunctionCall"]},
    {"name": "FunctionDeclaration$string$1", "symbols": [{"literal":"関"}, {"literal":"数"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FunctionDeclaration$string$2", "symbols": [{"literal":"挨"}, {"literal":"拶"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FunctionDeclaration$string$3", "symbols": [{"literal":"名"}, {"literal":"前"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FunctionDeclaration", "symbols": ["FunctionDeclaration$string$1", "_", "FunctionDeclaration$string$2", "_", {"literal":"("}, "_", "FunctionDeclaration$string$3", "_", {"literal":")"}, "_", "Block"]},
    {"name": "FunctionCall$string$1", "symbols": [{"literal":"名"}, {"literal":"前"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FunctionCall$string$2", "symbols": [{"literal":"表"}, {"literal":"示"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "FunctionCall", "symbols": ["FunctionCall$string$1", "_", {"literal":"を"}, "_", "FunctionCall$string$2"]},
    {"name": "ReturnStatement$string$1", "symbols": [{"literal":"名"}, {"literal":"前"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ReturnStatement$string$2", "symbols": [{"literal":"返"}, {"literal":"却"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ReturnStatement", "symbols": ["ReturnStatement$string$1", "_", {"literal":"を"}, "_", "ReturnStatement$string$2"]},
    {"name": "Block", "symbols": [{"literal":"{"}, "_", "StatementList", "_", {"literal":"}"}]},
    {"name": "_", "symbols": [{"literal":" "}]},
    {"name": "_", "symbols": [{"literal":"\n"}]}
]
  , ParserStart: "Program"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
