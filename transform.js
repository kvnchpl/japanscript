
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
          condition: transform(node[0]), // Expression
          consequent: transform(node[2]), // Block
          alternate: node.includes("他") ? transform(node[4]) : null // Optional Block
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
          condition: transform(node[0]), // Expression
          body: transform(node[2]) // Block
        };
      }
  
      // Handle TryCatchStatement
      if (node.includes("試み")) {
        return {
          type: "TryCatchStatement",
          tryBlock: transform(node[1]), // Block
          catchParam: node[4], // Identifier
          catchBlock: transform(node[6]), // Block
        };
      }
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

