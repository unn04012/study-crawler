import { In, Repository } from 'typeorm';

import { CrawledHistorySchema } from '../schema/crawled-history.schema';
import { StudyEntity } from '../study.entity';
import { ICrawledHistoryRepository, CrawledHistory } from './crawled-history.repository.interface';

export class CrawledHistoryRepositoryMySQL implements ICrawledHistoryRepository {
  constructor(private readonly _repo: Repository<CrawledHistorySchema>) {}

  public async getCrawledList(crawlIds: string[]): Promise<CrawledHistory[]> {
    const founds = await this._repo.find({ where: { titleHash: In(crawlIds) } });

    return founds.map((found) => this._mapperd(found));
  }

  public async bulkInsert(history: StudyEntity[]): Promise<void> {
    const entities = history.map((e) => {
      return this._repo.create({
        titleHash: e.crawlId,
        title: e.title,
        content: e.content,
      });
    });

    await this._repo.insert(entities);
  }

  private _mapperd(schmea: CrawledHistorySchema): CrawledHistory {
    return {
      hashTitle: schmea.titleHash,
      title: schmea.title,
      content: schmea.content,
    };
  }
}
