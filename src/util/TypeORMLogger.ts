import { QueryRunner, Logger } from 'typeorm';
import winston from './logger';

export default class TypeORMLogger implements Logger {
    private stringifyParams(parameters: any[]) {
        try {
            return JSON.stringify(parameters);
        } catch (error) {
            return parameters;
        }
    }

    logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner) {
        const sql =
            query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '');
        winston.info(sql);
    }

    /**
     * Logs query that is failed.
     */
    logQueryError(error: string, query: string, parameters?: any[], _queryRunner?: QueryRunner) {
        const sql =
            query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '');
        winston.error(`query failed: ` + sql);
        winston.error(`error:`, error);
    }

    /**
     * Logs query that is slow.
     */
    logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner) {
        const sql =
            query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '');
        winston.warn(`query is slow: ` + sql);
        winston.warn(`execution time: ` + time);
    }

    /**
     * Logs events from the schema build process.
     */
    logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
        winston.info(message);
    }

    /**
     * Logs events from the migrations run process.
     */
    logMigration(message: string, _queryRunner?: QueryRunner) {
        winston.info(message);
    }

    /**
     * Perform logging using given logger, or by default to the console.
     * Log has its own level and message.
     */
    log(level: 'log' | 'info' | 'warn', message: any, _queryRunner?: QueryRunner) {
        switch (level) {
            case 'log':
            case 'info':
                winston.info(message);
                break;
            case 'warn':
                winston.warn(message);
                break;
        }
    }
}
