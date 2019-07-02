import * as request from 'request-promise';
import * as fs from 'fs-extra';

// まつり
const API_BASE = 'https://api.matsurihi.me/mltd/v1/events/92/rankings/logs/idolPoint';
// 取得するランキング。1度に10個まで。
const GET_RANK_LIST = ['1,2,3,4,5', '10,20,30,40,50,60,70,80,90', '100,150,200,250,300,350,400,450,500,550', '600,650,700,750,800,850,900,950,1000,2000'];

// 35:ひなた 40:たまき 44:瑞希 49:桃子 52:歌織
const IDOL_ID_LIST: number[] = [35, 40];

type MatsuriApiEventsRankingIdolPoint = {
  rank: number;
  data: {
    score: number;
    summaryTime: string;
  }[];
}[];

/**
 * テキストファイルに上書き保存
 * @param filepath ファイルパス
 * @param dataStr 文字
 */
const writeTextFile = async (filepath: string, dataStr: string) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, dataStr, err => {
      if (err) reject(err);
      resolve();
    });
  });
};

/**
 * Dateオブジェクトを、YYYY/MM/DD HH:MM形式にする
 * @param date
 */
export const converDateToStr = (date: Date): string => {
  const year = `0000${date.getFullYear()}`.slice(-4);
  const month = `00${date.getMonth() + 1}`.slice(-2);
  const day = `00${date.getDate()}`.slice(-2);
  const hour = `00${date.getHours()}`.slice(-2);
  const minute = `00${date.getMinutes()}`.slice(-2);
  return `${year}/${month}/${day} ${hour}:${minute}`;
};

/**
 * スリープ
 * @param msec
 */
const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));

(async () => {
  for (const idolId of IDOL_ID_LIST) {
    const SAVE_FILE_NAME = `idol_${idolId}.csv`;

    const rankList: MatsuriApiEventsRankingIdolPoint = [];
    for (const rank of GET_RANK_LIST) {
      const options: request.Options = {
        uri: `${API_BASE}/${idolId}/${rank}`,
        json: true
      };
      try {
        const response: MatsuriApiEventsRankingIdolPoint = await request.get(options);
        //   console.log(response.length);
        rankList.push(...response);
        await sleep(500);
      } catch (e) {
        console.error(e);
      }
    }

    // 時刻基準で集計する
    const timeList = rankList[0].data.map(item => item.summaryTime);

    let data: string = '';
    // ヘッダ
    data += '時刻,';
    rankList.map(rank => (data += `${rank.rank},`));

    // データ
    for (const time of timeList) {
      data += `${converDateToStr(new Date(time))},`;
      for (const rank of rankList) {
        const filterd = rank.data.filter(item => item.summaryTime === time);
        data += filterd.length !== 0 ? `${filterd[0].score},` : ',';
      }
      data += '\n';
    }

    writeTextFile(SAVE_FILE_NAME, data);
  }
})();
