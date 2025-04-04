
const nearley = require("nearley");
const grammar = require("./japanscript.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `
関数 挨拶 ( 名前 ) {
名前 を 表示
名前 を 返却
}
`;

try {
  parser.feed(input);
  console.log(JSON.stringify(parser.results, null, 2));
} catch (e) {
  console.error("パースエラー:", e.message);
}
