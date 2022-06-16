const eslint = "eslint --fix";
const prettier = "prettier --write";
const prettierCheck = "prettier --check";

module.exports = {
  "*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue}": [eslint, prettierCheck],
  "*.{md,css,scss,json,yml,yaml,gql,graphql}": [prettier],
};
