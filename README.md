# idolRankFromMatsuri
dataset by matsurihi.me

# 起動方法
パッケージインストール
```
npm install
```
実行
```
npm start
```

# edit
`src/index.ts`

## 取得するアイドルを変える
`IDOL_ID_LIST` を好きなアイドルのIDに修正して実行すればOK。

## 取得するランキングを変える
`GET_RANK_LIST`を取得したい順位にすればOK。

1リクエストに指定できる順位が10個までなので、最大10個区切りで指定すること。

最終的に出力される結果は結合されるので、2個、3個、10個みたいな指定でも問題ないです。