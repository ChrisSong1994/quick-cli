import type * as Rspack from '@rspack/core';
import chalk from 'chalk';
import cliui from 'cliui';

const ui = cliui({ width: process.stdout.columns || 80 });

export const formatStats = (statusJson: any) => {
  let assets = statusJson?.assets
    ? statusJson.assets
    : (statusJson?.children as Rspack.StatsCompilation[]).reduce(
        (acc, child) => acc.concat(child.assets),
        [],
      );

  const seenNames = new Map();
  const isJS = (val: string) => /\.js$/.test(val);
  const isCSS = (val: string) => /\.css$/.test(val);

  assets = assets
    .map((a: any) => {
      a.name = a.name.split('?')[0];
      return a;
    })
    .filter((a: any) => {
      if (seenNames.has(a.name)) {
        return false;
      }
      seenNames.set(a.name, true);
      return a.name;
    })
    .sort((a: any, b: any) => {
      if (isJS(a.name) && isCSS(b.name)) return -1;
      if (isCSS(a.name) && isJS(b.name)) return 1;
      return b.size - a.size;
    });

  function formatSize(size: number) {
    return (size / 1024).toFixed(2) + ' KiB';
  }

  function makeRow(a: any, b: any, c?: any) {
    return `  ${a}\t  ${b}\t ${c}`;
  }

  function formatChunks(chunks: string[]) {
    return chunks.join(',');
  }

  function nameColoring(name: string) {
    if (isJS(name)) {
      return chalk.greenBright(name);
    } else if (isCSS(name)) {
      return chalk.blueBright(name);
    } else if (/package\.json$/.test(name)) {
      return chalk.yellow(name);
    } else {
      return chalk.cyanBright(name);
    }
  }

  ui.div(
    makeRow(chalk.cyan.bold(`File`), chalk.cyan.bold(`Size`), chalk.cyan.bold(`Chunks`)) +
      `\n` +
      assets
        .map((asset: any) =>
          makeRow(
            nameColoring(asset.name),
            formatSize(asset.size),
            formatChunks(Array.from(asset.chunkNames)),
          ),
        )
        .join(`\n`),
  );
  return {
    total: assets.length,
    content: `\n${ui.toString()}\n`,
  };
};
