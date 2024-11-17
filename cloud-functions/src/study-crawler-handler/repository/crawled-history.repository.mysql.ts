import { createHash } from 'crypto';
import { In, Repository } from 'typeorm';
import { Study } from '../crawler/study-crawler.interface';

import { CrawledHistorySchema } from '../schema/crawled-history.schema';
import { ICrawledHistoryRepository, CrawledHistory } from './crawled-history.repository.interface';

export class CrawledHistoryRepositoryMySQL implements ICrawledHistoryRepository {
  constructor(private readonly _repo: Repository<CrawledHistorySchema>) {}

  public async getCrawledList(sendIds: string[]): Promise<CrawledHistory[]> {
    const hashedTitles = sendIds.map((e) => this._hashTitle(e));

    const founds = await this._repo.find({ where: { titleHash: In(hashedTitles) } });

    return founds.map((found) => this._mapperd(found));
  }

  public async bulkInsert(history: Study[]): Promise<void> {
    const entities = history.map((e) => {
      return this._repo.create({
        titleHash: this._hashTitle(e.title),
        title: e.title,
        content: e.content,
      });
    });

    await this._repo.insert(entities);
  }

  private _hashTitle(title: string) {
    return createHash('md5').update(title).digest('hex');
  }

  private _mapperd(schmea: CrawledHistorySchema): CrawledHistory {
    return {
      title: schmea.title,
      content: schmea.content,
    };
  }
}
