export type Config = {
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
};

export type MatsuriApiEventsRankingIdolPoint = {
  rank: number;
  data: {
    score: number;
    summaryTime: string;
  }[];
}[];
