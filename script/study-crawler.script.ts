import { SQSEvent } from 'aws-lambda';

import { studyCrawler } from '../src/study-crawler-handler/study-crawling.handler';
(async () => {
  const event = {
    Records: [{ body: JSON.stringify({ type: 'INFLEARN', keywords: [], search: '스터디' }) }],
  };

  await studyCrawler(<SQSEvent>event);

  process.exit(1);
})();
