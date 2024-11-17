import 'dotenv/config';
import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { DataSource } from 'typeorm';

import { studyCrawlerFactory } from './crawler/study-crawler-factory';
import { CrawledHistorySchema } from './schema/crawled-history.schema';
import { CrawledHistoryRepositoryMySQL } from './repository/crawled-history.repository.mysql';
import { initTypeormConnection } from '../infrastructure/typeorm-initialize';
import { Study } from './crawler/study-crawler.interface';
import { SlackReporterHTTP } from './slack.reporter.http';

export async function studyCrawler(event: SQSEvent): Promise<APIGatewayProxyResult> {
  // 이벤트에서 SQS 메시지 추출
  const { slackWebhookUrl, mysql } = getEnv();
  const ds = await initTypeormConnection(mysql);
  const crawledRepository = getRepository(ds);
  const slackReporter = new SlackReporterHTTP(slackWebhookUrl);
  console.log('hello world');
  const crawlerFactory = studyCrawlerFactory();
  const crawler = crawlerFactory('INFLEARN');

  const record = event.Records[0];
  const body = record.body; // 메시지 내용
  console.log('SQS Message Body:', body);

  // 메시지를 JSON으로 파싱 (필요한 경우)
  const data = JSON.parse(body);
  console.log('Parsed Message:', data);

  const { keywords, search } = data;

  const studyList = await crawler.getStudyList(search);
  // 이전에 크롤링하여 전송한 이력이 있는 것들은 제외합니다.
  const crawledHistories = await crawledRepository.getCrawledList(studyList.map((e) => e.title));
  const filteredStudyList = studyList.filter((e) => !crawledHistories.map((e) => e.title).includes(e.title));
  console.log(crawledHistories);
  const foundStudyListInKeyword: Study[] = [];
  for (const keyword of keywords) {
    const foundInTitle = filteredStudyList.find((e) => e.title.toLocaleLowerCase().trim().includes(keyword));
    if (foundInTitle) {
      foundStudyListInKeyword.push(foundInTitle);
    } else {
      const foundInContents = filteredStudyList.find((e) => e.content.toLocaleLowerCase().trim().includes(keyword));
      if (foundInContents) foundStudyListInKeyword.push(foundInContents);
    }
  }

  await crawledRepository.bulkInsert(foundStudyListInKeyword);

  // await slackReporter.reportStudyList(foundStudyListInKeyword);

  return {
    statusCode: 200,
    body: 'success',
  };
}

export function getEnv() {
  const envReader = loadFromEnvMandatory(process.env);

  return {
    slackWebhookUrl: envReader('SLACK_WEBHOOK_URL'),
    mysql: {
      host: envReader('MYSQL_HOST'),
      port: Number(envReader('MYSQL_PORT')),
      user: envReader('MYSQL_USER'),
      password: envReader('MYSQL_PASSWORD'),
      database: envReader('MYSQL_DATABASE'),
    },
  };
}

function loadFromEnvMandatory(source: Record<string, string | undefined>) {
  return (key: string) => {
    const found = source[key];
    if (!found) {
      throw new Error(`the env-variable: ${key} was not found`);
    }
    return found;
  };
}

function getRepository(ds: DataSource) {
  const schema = ds.getRepository(CrawledHistorySchema);
  const repo = new CrawledHistoryRepositoryMySQL(schema);

  return repo;
}
