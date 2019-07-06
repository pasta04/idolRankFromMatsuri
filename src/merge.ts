/**
 * 保存したCSVファイルをマージして、特定の順位におけるCSVを作る
 */

import { isFileExist, readFileText, writeTextFile, converDateToStr } from './util';
import { Config, MatsuriApiEventsRankingIdolPoint } from './types';
const config = require('./config.json') as Config;
const idolListMap = require('./idolList.json') as { [id: string]: string };

const FILE_NAME_PREFIX = `data/tmp/event_${config.eventId}_idol_`;
const FILE_NAME_SUFFIX = '.json';

const SAVE_FILE_NAME = `data/event_${config.eventId}_mergeRank_${config.merge.targetRank}.csv`;

(async () => {
  console.log('マージ開始');

  // 全アイドルのデータを読み込む
  const allIdolData: {
    id: number;
    name: string;
    data: MatsuriApiEventsRankingIdolPoint;
  }[] = [];

  for (const idolId of config.idolList) {
    const idolname = idolListMap[idolId];
    const filename = `${FILE_NAME_PREFIX}${idolId}_${idolname}${FILE_NAME_SUFFIX}`;
    if (!(await isFileExist(filename))) {
      console.log(`JSONファイルが不足しています: ${idolId} ${idolname}`);
      return;
    }
    const json = JSON.parse(await readFileText(filename, 'utf-8')) as MatsuriApiEventsRankingIdolPoint;
    allIdolData.push({
      id: idolId,
      name: idolname,
      data: json
    });
  }

  // 出力データに整形する
  let data: string = '';

  // ヘッダ
  data += `時刻,`;
  allIdolData.map(idol => (data += `${idol.name},`));
  data += '\n';

  // 全時刻
  const timeList = allIdolData[0].data[0].data.map(item => item.summaryTime);

  // データ
  for (const time of timeList) {
    const convertedDate = `${converDateToStr(new Date(time))}`;
    // 特定の時刻だけの抽出設定がされてる場合は、時刻をチェックして、違ったらスキップ
    if (config.merge.pickSpecificDate && !convertedDate.includes(config.merge.pickSpecificDate)) continue;

    data += `${convertedDate},`;

    for (const idol of allIdolData) {
      const tmp = idol.data.filter(data => data.rank === config.merge.targetRank);
      const rankData = tmp[0];
      const filterd = rankData.data.filter(data => data.summaryTime === time);
      data += filterd.length !== 0 ? `${filterd[0].score},` : ',';
    }
    data += '\n';
  }
  await writeTextFile(SAVE_FILE_NAME, data);
  console.log('マージ完了');
})();
