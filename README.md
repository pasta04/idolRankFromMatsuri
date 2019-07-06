# idolRankFromMatsuri
dataset by matsurihi.me

## インストール
```
npm install
```

## 実行: データの取得
```
npm run get
```
成功すると、dataディレクトリ内にアイドルごとのCSVファイルが生成されます。

## 実行: データのマージ
```
npm run merge
```
成功すると、dataディレクトリ内に`event_{イベントID}_mergeRank_{マージ対象のランク}.csv`のファイルが生成されます。

# 設定
`src/config.json`
[型定義](src/types.ts)を参照。
