import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CrawledHistorySchema } from '../study-crawler-handler/schema/crawled-history.schema';

type MysqlConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export async function initTypeormConnection(config: MysqlConfig): Promise<DataSource> {
  const { host, user, password, port, database } = config;

  // const entities = `${__dirname}/schemas/**/*.{js,ts}`;
  const typeormDataSource = new DataSource({
    type: 'mysql',
    host,
    port,
    username: user,
    password,
    database,
    namingStrategy: new SnakeNamingStrategy(),
    entities: [CrawledHistorySchema],
    logging: false,
    synchronize: false,
    timezone: 'Z',
    extra: {
      connectionLimit: 1,
    },
  });

  return await typeormDataSource.initialize();
}
