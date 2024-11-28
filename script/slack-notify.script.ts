import 'dotenv/config';
import { SQSEvent } from 'aws-lambda';

import { studyCrawler } from '../src/study-crawler-handler/study-crawling.handler';
import { SlackReporterHTTP } from '../src/study-crawler-handler/slack.reporter.http';
import { StudyEntity } from '../src/study-crawler-handler/study.entity';
(async () => {
  const event = {
    Records: [{ body: JSON.stringify({ type: 'INFLEARN', keywords: [], search: '역삼' }) }],
  };

  const slackUrl = process.env['SLACK_WEBHOOK_URL'];

  const reporter = new SlackReporterHTTP(slackUrl);

  const entity = StudyEntity.fromCrawler({
    title: '테스트 제목',
    content: 'Hello world',
    link: 'https://www.naver.com',
    createdAt: '3일전',
  });

  await reporter.reportStudyList([entity]);

  process.exit(1);
})();
