const { interpret } = require("../../interpreter");

module.exports = function () {
  const input = `
試み {
  例外 を 投げる
} 捕捉 (過誤) {
  過誤 を 表示
}
`;

  const env = {
    表示: (arg) => {
      if (arg !== "例外") {
        throw new Error(`Expected "例外", but got "${arg}"`);
      }
    },
  };

  interpret([{ type: "TryCatchStatement", tryBlock: [], catchParam: "過誤", catchBlock: [] }], env);
};