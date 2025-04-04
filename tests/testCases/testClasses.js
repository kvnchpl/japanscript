const { interpret } = require("../../interpreter");

module.exports = function () {
  const input = `
構造 Person {
  関数 初期(name) {
    name を 自身.name に 代入
  }
}
生成(Person, "花子") を p に 宣言
p.name を 表示
`;

  const env = {
    表示: (arg) => {
      if (arg !== "花子") {
        throw new Error(`Expected "花子", but got "${arg}"`);
      }
    },
  };

  interpret([{ type: "ClassDeclaration", name: "Person", body: [] }], env);
};