import { StudyCrawlerInflearn } from './study-crawler-inflearn';
import { CrawlerType, IStudyCrawlerFactory } from './study-crawler.interface';

export function studyCrawlerFactory(): IStudyCrawlerFactory {
  return (type: CrawlerType) => {
    if (type === 'INFLEARN') return new StudyCrawlerInflearn();
    else throw new Error('not found crawler');
  };
}
