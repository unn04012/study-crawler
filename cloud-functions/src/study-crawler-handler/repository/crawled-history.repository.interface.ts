import { Study } from '../crawler/study-crawler.interface';

export type CrawledHistory = {
  title: string;
  content: string;
};
export interface ICrawledHistoryRepository {
  getCrawledList(sendIds: string[]): Promise<CrawledHistory[]>;

  bulkInsert(history: Study[]): Promise<void>;
}
