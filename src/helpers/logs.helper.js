import { cloudantClient, config, logger } from '../config';
import { Log, TransactingUser, Transaction } from '../models';
import autobind from 'es6-autobind';
import { LogsConst } from '../constants';

export class LogsHelper {
  constructor() {
    this.cloudant = cloudantClient.connectClient();

    autobind(this);
  }

  async logApiManagerTransaction({ route, numero, input, respuesta, callType }) {
    const db = config.cloudant.db.logsApimanager;
    const microservice = config.msName;
    const successLog = new Log({
      ts: new Date(),
      microservice,
      msgType: `${callType} dtv-registration.${route}`,
      numero,
      input,
      respuesta,
    });
    try {
      logger.info(`Try to save new document in the database ${db}`);

      const result = await this.cloudant.postDocument({ db, document: successLog });

      logger.info(`New document created in ${db}`);

      return result;
    } catch (error) {
      logger.error(`An error ocurred create new document in the database ${db}: ${error?.message}`);

      return null;
    }
  }

  async logTransaction({ number, transaction, request, response, success }) {
    const db = config.cloudant.db.registrationLogs;

    try {
      logger.info(`Try to save new document in the database ${db}`);

      const transactingUser = await this.getUserTransactions({ db, number });
      const newTransaction = {
        ...transactingUser,
        transactions: [
          ...transactingUser.transactions,
          new Transaction({
            transaction,
            request,
            response,
            success,
          }),
        ],
      };

      await this.cloudant.postDocument({ db, document: newTransaction });

      logger.info(`New document created in ${db}`);
    } catch (error) {
      logger.error(`An error ocurred create new document in the database ${db}: ${error?.message}`);

      return null;
    }
  }

  async getUserTransactions({ db, number }) {
    const user = await this.cloudant.postFind({
      db,
      selector: { number },
      fields: [...LogsConst.cloudantFields, ...TransactingUser.getAttributes()],
    });

    if (!user.result.docs.length) {
      return new TransactingUser({
        number,
        transactions: [],
      });
    }

    return user.result.docs[0];
  }
}
