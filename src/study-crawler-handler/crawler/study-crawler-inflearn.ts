import axios from 'axios';
import { load } from 'cheerio';
import { StudyEntity } from '../study.entity';
import { IStudyCrawler, Study } from './study-crawler.interface';

export class StudyCrawlerInflearn implements IStudyCrawler {
  private readonly _domain: string;
  private readonly _studyUrl: string;

  constructor() {
    this._domain = 'https://www.inflearn.com/';
    this._studyUrl = 'https://www.inflearn.com/community/studies?order=recent&status=unrecruited';
  }

  public async getStudyList(search: string): Promise<StudyEntity[]> {
    // URL 객체 생성
    const url = new URL(this._studyUrl);

    // 쿼리 파라미터 추가
    url.searchParams.append('s', search);
    // URL 출력
    console.log(url.toString());
    const response = await axios.get(url.toString());
    const $ = load(response.data);

    const studies: Study[] = [];

    $('li.question-container').each((_, element) => {
      const title = $(element).find('div.question__title h3.title__text').text().replace(/\s+/g, ' ').trim(); // question__title 추출
      const content = $(element).find('p.question__body').text().trim(); // question__body 추출

      const createdAt = $(element).find('div.question__info-detail span').eq(2).text().trim();
      const href = $(element).find('li.question-container a.e-click-post').attr('href')?.trim();

      const link = href ? new URL(href, this._domain).href : this._domain;

      studies.push({ title, content, createdAt, link }); // Study 객체로 추가
    });

    return studies.map((e) => StudyEntity.fromCrawler(e));
  }
}
