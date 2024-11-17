import axios from 'axios';
import { Study } from './crawler/study-crawler.interface';

export class SlackReporterHTTP {
  constructor(private readonly _slackWebhookUrl: string) {}

  public async reportStudyList(studies: Study[]) {
    if (studies.length === 0) {
      console.log('No studies to report.');
      return;
    }

    // Slack 메시지 형식 생성
    const blocks = studies.map((study) => ({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Title:* ${study.title}\n*Content:* ${study.content}\n*Created At:* ${study.createdAt}\n${
          study.link ? `<${study.link}|View Study>` : ''
        }`,
      },
    }));

    // Slack Webhook에 전송
    const payload = {
      text: 'Here are the latest studies:', // 기본 텍스트
      blocks, // Block Kit 형식
    };

    try {
      await axios.post(this._slackWebhookUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Study list successfully sent to Slack.');
    } catch (error) {
      console.error('Failed to send study list to Slack:', error);
      throw error;
    }
  }
}
