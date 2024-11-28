import { StudyEntity } from '../study.entity';

export type CrawledHistory = {
  hashTitle: string;
  title: string;
  content: string;
};
export interface ICrawledHistoryRepository {
  getCrawledList(crawlIds: string[]): Promise<CrawledHistory[]>;

  bulkInsert(history: StudyEntity[]): Promise<void>;
}
