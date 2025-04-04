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
      if (node.includes("関数")) {
        return {
          type: "FunctionDeclaration",
          name: node[1], // Function name
          params: transform(node[3]), // Parameters
          body: transform(node[5]), // Function body (Block)
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

      // Handle ClassDeclaration
      if (node.includes("構造")) {
        return {
          type: "ClassDeclaration",
          name: node[1], // Class name
          superClass: node.includes("継承") ? node[4] : null, // Optional superclass
          body: transform(node[node.includes("継承") ? 6 : 3]), // Block
        };
      }

      // Handle EnumDeclaration
      if (node.includes("列挙")) {
        return {
          type: "EnumDeclaration",
          name: node[1], // Enum name
          values: node[3], // Enum values
        };
      }

      // Handle NewExpression
      if (node.includes("生成")) {
        return {
          type: "NewExpression",
          className: node[2], // Class name
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

      // Handle PatternMatching
      if (node.includes("判別")) {
        return {
          type: "PatternMatching",
          expression: transform(node[0]), // Expression to match
          cases: transform(node[3]), // Pattern list
        };
      }

      // Handle PatternCase
      if (node.includes("場合")) {
        return {
          type: "PatternCase",
          pattern: transform(node[0]), // Pattern
          guard: node.includes("なら") ? transform(node[2]) : null, // Optional guard
          body: transform(node[node.includes("なら") ? 4 : 2]), // Block
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

      // Handle TryCatchStatement
      if (node.includes("試み")) {
        return {
          type: "TryCatchStatement",
          tryBlock: transform(node[1]), // Try block
          catchParam: node[4], // Catch parameter
          catchBlock: transform(node[6]), // Catch block
        };
      }

      // Handle CallExpression (e.g., 表示)
      if (node.includes("を") && node.includes("表示")) {
        return {
          type: "CallExpression",
          callee: "表示",
          args: [transform(node[0])], // Argument
        };
      }

      // Handle ReturnStatement
      if (node.includes("を") && node.includes("返却")) {
        return {
          type: "ReturnStatement",
          value: transform(node[0]), // Return value
        };
      }

      // Recursively transform nested nodes
      return node.map(transform).filter(Boolean);
    }

    // Handle literals (e.g., numbers, strings, booleans)
    if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
      return { type: "Literal", value: node };
    }

    // Handle identifiers
    if (typeof node === "object" && node.type === "Identifier") {
      return node;
    }

    // Unsupported node
    throw new Error(`Unsupported node: ${JSON.stringify(node)}`);
  }

  // Utility: Clean and flatten the AST
  function clean(node) {
    if (Array.isArray(node)) {
      return node.flatMap(clean).filter(Boolean);
    }
    return node;
  }

  // Transform and clean the AST
  const ast = clean(transform(result));
  console.log(JSON.stringify(ast, null, 2));
} catch (e) {
  console.error("パースエラー:", e.message);
}