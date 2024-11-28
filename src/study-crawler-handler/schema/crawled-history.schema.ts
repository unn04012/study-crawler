import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('crawled_history')
export class CrawledHistorySchema {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '해싱된 제목',
  })
  public titleHash: string;

  @Column({
    type: 'varchar',
    comment: '제목',
  })
  public title: string;

  @Column({
    type: 'text',
    comment: '내용',
  })
  public content: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  public createdAt: Date;
}
