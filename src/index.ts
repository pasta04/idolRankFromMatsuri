import * as request from 'request-promise';
import { sleep, converDateToStr, writeTextFile } from './util';
import { Config, MatsuriApiEventsRankingIdolPoint } from './types';
const config = require('./config.json') as Config;
const idolListMap = require('./idolList.json') as { [id: string]: string };

// まつり
const API_BASE = `https://api.matsurihi.me/mltd/v1/events/${config.eventId}/rankings/logs/idolPoint`;

// 10個ずつに分割する
const split = config.get.rankList.split(',');
const rankArray: string[] = [];
let tmp = '';
let count = 0;
for (const rank of split) {
  tmp += `${rank},`;
  count++;
  if (count === 10) {
    rankArray.push(tmp);
    tmp = '';
    count = 0;
  }
}
// 余り
if (tmp !== '') {
  rankArray.push(tmp);
}

(async () => {
  for (const idolId of config.idolList) {
    const idolName = idolListMap[idolId];
    const SAVE_FILE_NAME_CSV = `data/event_${config.eventId}_idol_${idolId}_${idolName}.csv`;
    const SAVE_FILE_NAME_JSON = `data/tmp/event_${config.eventId}_idol_${idolId}_${idolName}.json`;

    const rankList: MatsuriApiEventsRankingIdolPoint = [];
    for (const rank of rankArray) {
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
    await writeTextFile(SAVE_FILE_NAME_JSON, JSON.stringify(rankList, null, '  '));

    // 時刻基準で集計する
    const timeList = rankList[0].data.map(item => item.summaryTime);

    let data: string = '';
    // ヘッダ
    data += '時刻,';
    rankList.map(rank => (data += `${rank.rank},`));
    data += '\n';

    // データ
    for (const time of timeList) {
      data += `${converDateToStr(new Date(time))},`;
      for (const rank of rankList) {
        const filterd = rank.data.filter(item => item.summaryTime === time);
        data += filterd.length !== 0 ? `${filterd[0].score},` : ',';
      }
      data += '\n';
    }

    await writeTextFile(SAVE_FILE_NAME_CSV, data);
  }
})();
