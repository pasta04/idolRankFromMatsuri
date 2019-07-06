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

```
  /** イベントID */
  eventId: number;
  /** 取得対象、およびマージ対象のアイドルID */
  idolList: number[];
  /** ボーダーデータの取得に関する設定 */
  get: {
    /** 取得対象のランク一覧。カンマ区切りで指定。 */
    rankList: string;
  };
  /** マージに関する設定 */
  merge: {
    /** マージ対象の順位 */
    targetRank: number;
    /**
     * マージする際、特定の時刻だけを抽出。
     * HH:MMで指定する。
     * このパラメータを指定しなかった場合は全時刻分出力する。
     * @example '00:00'
     * @example ''
     */
    pickSpecificDate: string;
  };
```
