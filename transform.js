
// transform.js
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
  const result = parser.results[0];

  // Recursive transformer
  function transform(node) {
    if (Array.isArray(node)) {
      // Handle VariableDeclaration
      if (node.includes("宣言") || node.includes("定義")) {
        return {
          type: "VariableDeclaration",
          kind: node.includes("宣言") ? "let" : "var",
          name: node[1], // Identifier
          value: transform(node[3]) // Expression
        };
      }
  
      // Handle IfStatement
      if (node.includes("なら")) {
        return {
          type: "IfStatement",
          condition: transform(node[0]), // Expression
          consequent: transform(node[2]), // Block
          alternate: node.includes("他") ? transform(node[4]) : null // Optional Block
        };
      }
  
      // Handle LoopStatement
      if (node.includes("繰返")) {
        return {
          type: "LoopStatement",
          condition: transform(node[0]), // Expression
          body: transform(node[2]) // Block
        };
      }
  
      // Handle other cases...
    }
    return null;
  }

  const ast = transform(result);

// Utility: flatten and filter empty
function clean(node) {
  if (Array.isArray(node)) {
    return node.flatMap(clean).filter(Boolean);
  }
  return node;
}

console.log(JSON.stringify(clean(ast), null, 2));
} catch (e) {
  console.error("パースエラー:", e.message);
}

