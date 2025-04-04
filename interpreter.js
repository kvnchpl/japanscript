
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
    // Handle FunctionDeclaration
    if (node.includes("関数")) {
      return {
        type: "FunctionDeclaration",
        name: node[1], // Function name
        params: node[3], // Parameters
        body: node.flatMap(transform).filter(Boolean), // Function body
      };
    }

    // Handle VariableDeclaration
    if (node.includes("宣言") || node.includes("定義")) {
      return {
        type: "VariableDeclaration",
        kind: node.includes("宣言") ? "let" : "var",
        name: node[1], // Variable name
        value: transform(node[3]), // Assigned value
      };
    }

    // Handle IfStatement
    if (node.includes("なら")) {
      return {
        type: "IfStatement",
        condition: transform(node[0]), // Condition
        consequent: transform(node[2]), // Consequent block
        alternate: node.includes("他") ? transform(node[4]) : null, // Optional alternate block
      };
    }

    // Handle LoopStatement
    if (node.includes("繰返")) {
      return {
        type: "LoopStatement",
        condition: transform(node[0]), // Loop condition
        body: transform(node[2]), // Loop body
      };
    }

    // Handle CallExpression
    if (node.includes("を") && node.includes("表示")) {
      return {
        type: "CallExpression",
        callee: "表示",
        args: [node[0]], // Argument
      };
    }

    // Handle ReturnStatement
    if (node.includes("を") && node.includes("返却")) {
      return {
        type: "ReturnStatement",
        value: node[0], // Return value
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

function interpret(ast, env = {}) {
  for (const node of ast) {
    switch (node.type) {
      case "VariableDeclaration":
        env[node.name] = evaluate(node.value, env);
        break;

      case "IfStatement":
        if (evaluate(node.condition, env)) {
          interpret(node.consequent, env);
        } else if (node.alternate) {
          interpret(node.alternate, env);
        }
        break;

      case "LoopStatement":
        while (evaluate(node.condition, env)) {
          interpret(node.body, env);
        }
        break;

      case "CallExpression":
        if (node.callee === "表示") {
          const value = evaluate(node.args[0], env);
          env.表示(value);
        }
        break;

      case "ReturnStatement":
        return evaluate(node.value, env);

      case "FunctionDeclaration":
        env[node.name] = node;
        break;

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
}

function evaluate(node, env) {
  if (typeof node === "string") {
    return env[node]; // Variable lookup
  }
  if (typeof node === "number" || typeof node === "boolean") {
    return node; // Literal values
  }
  if (node.type === "BinaryExpression") {
    const left = evaluate(node.left, env);
    const right = evaluate(node.right, env);
    switch (node.operator) {
      case "+": return left + right;
      case "-": return left - right;
      case "*": return left * right;
      case "/": return left / right;
      case "==": return left === right;
      case "!=": return left !== right;
      case "<": return left < right;
      case ">": return left > right;
      case "<=": return left <= right;
      case ">=": return left >= right;
    }
  }
  return null;
}

// Simulate calling 挨拶("ケビン")
const callExpression = {
  type: "CallExpression",
  callee: "挨拶",
  args: ["ケビン"],
};

interpret([callExpression], env);
