import { createHash } from 'crypto';

import { Study } from './crawler/study-crawler.interface';

export class StudyEntity {
  private readonly _id: number;
  private readonly _title: string;
  private readonly _content: string;
  private readonly _crawlId: string;
  private readonly _writedAt: string;
  private readonly _link?: string;

  private constructor({ title, content, createdAt, link }: Study) {
    this._title = title;
    this._content = content;
    this._writedAt = createdAt;
    this._link = link;
    this._crawlId = this._hashTitle(title, content);
  }

  static fromCrawler(study: Study) {
    return new StudyEntity(study);
  }
  get id() {
    return this._id;
  }
  get crawlId() {
    return this._crawlId;
  }
  get title() {
    return this._title;
  }
  get content() {
    return this._content;
  }
  get writedAt() {
    return this._writedAt;
  }
  get link() {
    return this._link;
  }

  private _hashTitle(title: string, content: string) {
    return createHash('md5')
      .update(title + content)
      .digest('hex');
  }
}
