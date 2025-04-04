const { interpret } = require("../../interpreter");

module.exports = function () {
  const input = `
x を 判別 {
  1 場合: 「一です」 を 表示
  2 場合: 「二です」 を 表示
  他: 「その他です」 を 表示
}
`;

  const env = {
    表示: (arg) => {
      const expectedOutputs = ["一です", "二です", "その他です"];
      if (!expectedOutputs.includes(arg)) {
        throw new Error(`Unexpected output: ${arg}`);
      }
      expectedOutputs.splice(expectedOutputs.indexOf(arg), 1); // Remove the matched output
    },
  };

  const ast = [
    {
      type: "PatternMatching",
      expression: { type: "Identifier", name: "x" },
      cases: [
        {
          pattern: { type: "Literal", value: 1 },
          body: [
            {
              type: "CallExpression",
              callee: "表示",
              args: [{ type: "Literal", value: "一です" }],
            },
          ],
        },
        {
          pattern: { type: "Literal", value: 2 },
          body: [
            {
              type: "CallExpression",
              callee: "表示",
              args: [{ type: "Literal", value: "二です" }],
            },
          ],
        },
        {
          pattern: { type: "DefaultCase" },
          body: [
            {
              type: "CallExpression",
              callee: "表示",
              args: [{ type: "Literal", value: "その他です" }],
            },
          ],
        },
      ],
    },
  ];

  // Simulate different values of x
  env.x = 1;
  interpret(ast, env);

  env.x = 2;
  interpret(ast, env);

  env.x = 3; // Should trigger the default case
  interpret(ast, env);
};