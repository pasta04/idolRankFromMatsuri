import * as fs from 'fs-extra';

/**
 * テキストファイルに上書き保存
 * @param filepath ファイルパス
 * @param dataStr 文字
 */
export const writeTextFile = async (filepath: string, dataStr: string) => {
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
export const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));

/**
 * awaitで囲いたいfs.exists
 * @param fullPath ファイルの絶対パス
 * @return true:存在する false:しない
 */
export const isFileExist = (fullPath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.exists(fullPath, (exists: boolean) => {
      resolve(exists);
    });
  });
};

/**
 * awaitで囲いたいreadFile
 * @param filePath ファイルのパス
 * @param code 文字コード
 * @return 読み込んだ文字列
 */
export const readFileText = (filePath: string, code: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, code, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
