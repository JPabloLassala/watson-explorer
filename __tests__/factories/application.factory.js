import { faker } from '@faker-js/faker';
import { Countries, Environments } from '../../src/constants';

const getFakeCountry = () => faker.helpers.arrayElement(Countries);
const getFakeEnvironment = () => faker.helpers.arrayElement(Environments);

export default { getFakeCountry, getFakeEnvironment };
