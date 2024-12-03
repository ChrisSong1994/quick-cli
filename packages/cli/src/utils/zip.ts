import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
function addFolderToZip(zip: any, folderPath: string, zipBasePath = '') {
  const files = fs.readdirSync(folderPath);
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(folderPath, files[i]);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      // 如果是目录，则递归调用
      addFolderToZip(zip, filePath, path.join(zipBasePath, files[i]));
    } else {
      // 如果是文件，则添加到 ZIP 文件中
      zip.addLocalFile(filePath, zipBasePath);
    }
  }
}

// 文件压缩
export const zip = async (output: string, input: string) => {
  // 创建一个空的 zip 对象
  let admZip = new AdmZip();

  addFolderToZip(admZip, input);

  admZip.writeZip(output);

  console.log('ZIP 文件创建成功');
};
