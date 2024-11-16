import { APIGatewayProxyEvent } from 'aws-lambda';
import { studyCrawler } from '../src/study-crawling-handler';
(async () => {
  const event = <APIGatewayProxyEvent>{};
  const crawler = studyCrawler(event);

  console.log(crawler);
})();
