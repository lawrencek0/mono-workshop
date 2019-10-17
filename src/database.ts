import { createConnection } from 'typeorm';
import { database } from './util/secrets';
import { User } from './entities/User';
import { Slot } from './entities/Slot';
import { Detail } from './entities/Detail';
import { Event } from './entities/Event';

export default async () => {
    await createConnection({
        type: 'mysql',
        host: database.MYSQL_HOSTNAME,
        port: parseInt(database.MYSQL_PORT),
        username: database.MYSQL_USER,
        password: database.MYSQL_PASSWORD,
        database: database.DATABASE,
        entities: [User, Slot, Detail, Event],
        synchronize: true,
        logging: false,
    });
};
