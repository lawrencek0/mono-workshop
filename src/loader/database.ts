import { createConnection } from 'typeorm';
import { database } from '../util/secrets';
import { User } from '../user/model';
import { Slot } from '../appointment/slot/models';
import { Detail } from '../appointment/detail/models';

export default async () => {
    await createConnection({
        type: 'mysql',
        host: database.MYSQL_HOSTNAME,
        port: parseInt(database.MYSQL_PORT),
        username: database.MYSQL_USER,
        password: database.MYSQL_PASSWORD,
        database: database.DATABASE,
        entities: [User, Slot, Detail],
        synchronize: false,
        logging: false,
    });
};
