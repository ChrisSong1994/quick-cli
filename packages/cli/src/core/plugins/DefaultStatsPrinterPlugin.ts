/**
 * 自定义 stats 信息打印插件
*/

import { type Compiler } from '@rspack/core';

const plural = (n: number, singular: unknown, plural: unknown) => (n === 1 ? singular : plural);

const SIMPLE_PRINTERS: Record<string, (thing: any, context: any, printer: any) => string | void> = {
  'compilation.summary!': (
    _,
    {
      type,
      bold,
      green,
      red,
      yellow,
      formatTime,
      compilation: { hash, time, errorsCount, warningsCount },
    },
  ) => {
    const root = type === 'compilation.summary!';
    const warningsMessage =
      warningsCount && warningsCount > 0
        ? yellow(`${warningsCount} ${plural(warningsCount, 'warning', 'warnings')}`)
        : '';
    const errorsMessage =
      errorsCount && errorsCount > 0
        ? red(`${errorsCount} ${plural(errorsCount, 'error', 'errors')}`)
        : '';
    const timeMessage = root && time ? ` in ${formatTime(time)}` : '';

    const subjectMessage = bold('Quick Cli');
    let statusMessage;
    if (errorsMessage && warningsMessage) {
      statusMessage = `compiled with ${errorsMessage} and ${warningsMessage}`;
    } else if (errorsMessage) {
      statusMessage = `compiled with ${errorsMessage}`;
    } else if (warningsMessage) {
      statusMessage = `compiled with ${warningsMessage}`;
    } else if (errorsCount === 0 && warningsCount === 0) {
      statusMessage = `compiled ${green('successfully')}`;
    } else {
      statusMessage = 'compiled';
    }
    if (
      errorsMessage ||
      warningsMessage ||
      (errorsCount === 0 && warningsCount === 0) ||
      timeMessage 
    )
      return `${subjectMessage} ${statusMessage}${timeMessage}`;
  },
};

export class DefaultStatsPrinterPlugin {
  apply(compiler: Compiler): void {
    compiler.hooks.compilation.tap('DefaultStatsPrinterPlugin', (compilation) => {
      compilation.hooks.statsPrinter.tap('DefaultStatsPrinterPlugin', (stats, options) => {
        for (const key of Object.keys(SIMPLE_PRINTERS)) {
          // @ts-expect-error
          stats.hooks.print.for(key).tap('DefaultStatsPrinterPlugin', (obj, ctx) => {
            return SIMPLE_PRINTERS[key](
              obj,
              {
                ...ctx,
                compilation: {
                  hash: compilation.hash,
                  // @ts-expect-error
                  time: compilation.endTime - compilation.startTime,
                  errorsCount: compilation.errors.length,
                  warningsCount: compilation.warnings.length,
                },
              },
              stats,
            );
          });
        }
      });
    });
  }
}
