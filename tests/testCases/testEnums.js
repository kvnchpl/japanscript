const { interpret } = require("../../interpreter");

module.exports = function () {
  const input = `
列挙 Color {
  RED, GREEN, BLUE
}
Color.RED を 表示
Color.GREEN を 表示
Color.BLUE を 表示
`;

  const env = {
    表示: (arg) => {
      const expectedValues = [0, 1, 2];
      if (!expectedValues.includes(arg)) {
        throw new Error(`Unexpected value: ${arg}`);
      }
      expectedValues.splice(expectedValues.indexOf(arg), 1); // Remove the matched value
    },
  };

  const ast = [
    {
      type: "EnumDeclaration",
      name: "Color",
      values: ["RED", "GREEN", "BLUE"],
    },
    {
      type: "CallExpression",
      callee: "表示",
      args: [{ type: "Identifier", name: "Color.RED" }],
    },
    {
      type: "CallExpression",
      callee: "表示",
      args: [{ type: "Identifier", name: "Color.GREEN" }],
    },
    {
      type: "CallExpression",
      callee: "表示",
      args: [{ type: "Identifier", name: "Color.BLUE" }],
    },
  ];

  interpret(ast, env);
};