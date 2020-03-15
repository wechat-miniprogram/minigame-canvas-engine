
npm run docs:build
rm -r docs
mkdir docs
cp  docsource/playground/index.html docs/playground.html
cp  docsource/playground/app.js docs/app.js
cp -r docsource/docs/.vuepress/dist docs
