import { getProperty } from '../helpers/enums.helper';

export const Environments = new Proxy(['desa', 'uat', 'prod'], getProperty);
export const Countries = new Proxy(['ar', 'cl', 'co', 'ec', 'uy', 'pe'], getProperty);
export const LoggerLevel = new Proxy(['debug', 'info', 'error'], getProperty);
