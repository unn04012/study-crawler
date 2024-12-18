import { StudyEntity } from '../study.entity';

export type Study = {
  title: string;
  content: string;
  createdAt: string;
  link?: string;
};

export type CrawlerType = 'INFLEARN';

// 스터디 클롤러 인터페이스
export interface IStudyCrawler {
  getStudyList(search: string): Promise<StudyEntity[]>;
}

export interface IStudyCrawlerFactory {
  (type: CrawlerType): IStudyCrawler;
}
