const nearley = require("nearley");
const grammar = require("./japanscript.js");

// Parse the input code into an AST
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `
関数 挨拶 ( 名前 ) {
  名前 を 表示
  名前 を 返却
}
`;

parser.feed(input);
const result = parser.results[0];

// Transformer: Convert raw AST into structured AST
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
        value: transform(node[0]), // Return value
      };
    }

    return node.map(transform).filter(Boolean);
  }
  return null;
}

// Clean up the AST
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
  デバッグ: () => console.log(env),
  長さ: (str) => str.length, // Get string length
  結合: (str1, str2) => str1 + str2, // Concatenate strings
  含む: (str, substr) => str.includes(substr), // Check if a string contains a substring
};

// Interpret the AST
function interpret(ast, env = {}) {
  for (const node of ast) {
    switch (node.type) {
      case "ClassDeclaration":
        env[node.name] = {
          type: "Class",
          superClass: node.superClass ? env[node.superClass] : null,
          body: node.body,
        };
        break;

      case "NewExpression":
        const classDef = env[node.className];
        if (!classDef) throw new Error(`Class ${node.className} not found`);
        const instance = { __proto__: classDef };
        interpret(classDef.body, { ...env, 自身: instance });
        return instance;

      case "VariableDeclaration":
        env[node.name] = evaluate(node.value, env);
        break;

      case "EnumDeclaration":
        env[node.name] = {};
        node.values.forEach((value, index) => {
          env[node.name][value] = index;
        });
        break;

      case "StaticMethodDeclaration":
        env[node.className][node.name] = (...args) => interpret(node.body, { ...env, args });
        break;

      case "IfStatement":
        if (evaluate(node.condition, env)) {
          interpret(node.consequent, env);
        } else if (node.alternate) {
          interpret(node.alternate, env);
        }
        break;

      case "PatternMatching":
        const value = evaluate(node.expression, env);
        for (const patternCase of node.cases) {
          if (matchPattern(value, patternCase.pattern, env)) {
            interpret(patternCase.body, env);
            break;
          }
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

      case "TypeCheck":
        value = evaluate(node.value, env);
        const type = node.typeName;
        if (typeof value !== type) {
          throw new Error(`Type error: Expected ${type}, got ${typeof value}`);
        }
        break;

      case "FunctionDeclaration":
        env[node.name] = node;
        break;

      case "ThrowStatement":
        throw new Error(evaluate(node.value, env));
        break;
      
      case "TryCatchStatement":
        try {
          interpret(node.tryBlock, env);
        } catch (error) {
          const localEnv = { ...env, [node.catchParam]: error.message };
          interpret(node.catchBlock, localEnv);
        }
        break;

      case "ImportStatement":
        const moduleName = node.moduleName;
        const modulePath = `./modules/${moduleName}.js`;
        const moduleExports = require(modulePath);
        Object.assign(env, moduleExports); // Merge module exports into the environment
        break;

      case "ExportStatement":
        env[node.name] = evaluate(node.value, env); // Add the exported value to the environment
        break;

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
}

// Evaluate expressions
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