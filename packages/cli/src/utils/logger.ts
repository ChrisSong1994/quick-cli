import color from 'picocolors';
import { type Logger, logger } from 'rslog';

export const isDebug = (): boolean => {
  if (!process.env.DEBUG) {
    return false;
  }

  return true;
};

if (isDebug()) {
  logger.level = 'verbose';
}

function getTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

logger.override({
  debug: (message, ...args) => {
    if (logger.level !== 'verbose') {
      return;
    }
    const time = color.gray(`${getTime()}`);
    console.log(`  ${color.magenta('quick')} ${time} ${message}`, ...args);
  },
});

export { logger };
export type { Logger };
