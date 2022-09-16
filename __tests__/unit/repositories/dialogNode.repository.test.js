import { faker } from '@faker-js/faker';
import { createAssistant } from '../../../src/config';
import { DialogNodeRepository } from '../../../src/repositories/dialogNode.repository';
import { applicationFactory, dialogNodeFactory } from '../../factories';

describe('Test Watson Nodes Repository', () => {
  const dialogNodeRepository = new DialogNodeRepository();
  let country;
  let env;

  beforeEach(() => {
    country = applicationFactory.getFakeCountry();
    env = applicationFactory.getFakeEnvironment();
  });

  test('Get Dialog Node Success', async () => {
    const assistant = createAssistant({ country, env });
    const nodeName = faker.lorem.word();
    const fakeNode = dialogNodeFactory.getFakeGetDialogNodeSuccess(nodeName);

    assistant.getDialogNode = jest.fn(async () => Promise.resolve(fakeNode));
    const result = await dialogNodeRepository.getDialogNodeId({ country, env, nodeId: nodeName }, assistant);

    expect(result).toMatchObject(fakeNode.result);
  });

  test('Get Dialog Node Failure', async () => {
    const assistant = createAssistant({ country, env });
    const nodeName = faker.lorem.word();
    const failResponse = dialogNodeFactory.getFakeGetDialogNodesFail(nodeName);

    assistant.getDialogNode = jest.fn().mockRejectedValue(async () => Promise.reject(failResponse));

    expect(async () => await dialogNodeRepository.getDialogNodeId({ country, env, nodeId: nodeName })).rejects.toMatch(failResponse);
  });
});
