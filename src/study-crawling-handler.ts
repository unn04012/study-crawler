import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { studyCrawlerFactory } from './crawler/study-crawler-factory';

export async function studyCrawler(event: SQSEvent): Promise<APIGatewayProxyResult> {
  // 이벤트에서 SQS 메시지 추출
  const crawlerFactory = studyCrawlerFactory();
  for (const record of event.Records) {
    const body = record.body; // 메시지 내용
    console.log('SQS Message Body:', body);

    // 메시지를 JSON으로 파싱 (필요한 경우)
    const data = JSON.parse(body);
    console.log('Parsed Message:', data);

    const crawler = crawlerFactory('INFLEARN');

    const studyList = await crawler.getStudyList();
  }

  return {
    statusCode: 200,
    body: studyList.join(''),
  };
}
