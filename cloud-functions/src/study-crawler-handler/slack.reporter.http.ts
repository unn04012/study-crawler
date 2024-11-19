import axios from 'axios';
import { StudyEntity } from './study.entity';

export class SlackReporterHTTP {
  constructor(private readonly _slackWebhookUrl: string) {}

  public async reportStudyList(studies: StudyEntity[]) {
    if (studies.length === 0) {
      console.log('No studies to report.');
      return;
    }

    // Slack 메시지 형식 생성
    const blocks = studies.flatMap((study) => [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*📚 Title:* ${study.title}\n*📅 Created At:* ${study.writedAt}\n${
            study.link ? `🔗 <${study.link}|View Study>` : ''
          }\n*📝 Content:*\n\`\`\`${study.content}\`\`\``,
        },
      },
      {
        type: 'divider', // 구분선 추가
      },
    ]);

    // 마지막 구분선 제거
    blocks.pop();

    const payload = {
      text: '📝 Here are the latest studies:', // 기본 텍스트
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
