
// interpreter.js
const nearley = require("nearley");
const grammar = require("./japanscript.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `
関数 挨拶 ( 名前 ) {
名前 を 表示
名前 を 返却
}
`;

parser.feed(input);
const result = parser.results[0];

// Transformer: extract AST
function transform(node) {
  if (Array.isArray(node)) {
    if (node.includes("関数") && node.includes("挨拶")) {
      return {
        type: "FunctionDeclaration",
        name: "挨拶",
        params: ["名前"],
        body: node.flatMap(transform).filter(Boolean)
      };
    }
    if (node.includes("を") && node.includes("表示")) {
      return {
        type: "CallExpression",
        callee: "表示",
        args: ["名前"]
      };
    }
    if (node.includes("を") && node.includes("返却")) {
      return {
        type: "ReturnStatement",
        value: "名前"
      };
    }
    return node.map(transform).filter(Boolean);
  }
  return null;
}

function clean(node) {
  if (Array.isArray(node)) {
    return node.flatMap(clean).filter(Boolean);
  }
  return node;
}

const ast = clean(transform(result));

// Simple runtime environment
const env = {
  表示: (arg) => console.log(arg),
};

function interpretFunction(fnNode, argValue) {
  const localEnv = { 名前: argValue, ...env };
  const statements = fnNode.body.flat(Infinity).filter(n => typeof n === 'object');
  for (const stmt of statements) {
    if (stmt.type === "CallExpression" && stmt.callee === "表示") {
      const value = localEnv[stmt.args[0]];
      env.表示(value);
    }
    if (stmt.type === "ReturnStatement") {
      return localEnv[stmt.value];
    }
  }
}

// Simulate calling 挨拶("ケビン")
const func = ast.find((n) => n.type === "FunctionDeclaration");
const returnValue = interpretFunction(func, "ケビン");
console.log("返却:", returnValue);
