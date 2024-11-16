import 'dotenv/config';
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
    //TODO filtering already sended
  }

  return {
    statusCode: 200,
    body: '',
  };
}

export function getEnv() {
  const envReader = loadFromEnvMandatory(process.env);
  return {
    slackWebhookUrl: envReader('SLACK_WEBHOOK_URL'),
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
