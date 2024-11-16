import axios from 'axios';
import { load } from 'cheerio';
import { IStudyCrawler, Study } from './study-crawler.interface';

export class StudyCrawlerInflearn implements IStudyCrawler {
  private readonly _domain: string;
  private readonly _studyUrl: string;

  constructor() {
    this._domain = 'https://www.inflearn.com/';
    this._studyUrl = 'https://www.inflearn.com/community/studies?s=%EC%8A%A4%ED%84%B0%EB%94%94&order=recent&status=unrecruited';
  }

  public async getStudyList(): Promise<Study[]> {
    const response = await axios.get(this._studyUrl);
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

    return studies;
  }
}
