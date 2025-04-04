
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
      // Handle FunctionDeclaration
      if (node.includes("関数") && node.includes("挨拶")) {
        return {
          type: "FunctionDeclaration",
          name: "挨拶",
          params: ["名前"],
          body: node.flatMap(transform).filter(Boolean)
        };
      }

      // Handle CallExpression: 名前 を 表示
      if (node.includes("を") && node.includes("表示")) {
        return {
          type: "CallExpression",
          callee: "表示",
          args: ["名前"]
        };
      }

      // Handle ReturnStatement: 名前 を 返却
      if (node.includes("を") && node.includes("返却")) {
        return {
          type: "ReturnStatement",
          value: "名前"
        };
      }

      // Recursively check children
      return node.map(transform).filter(Boolean);
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

