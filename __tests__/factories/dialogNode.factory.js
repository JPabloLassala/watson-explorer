import { faker } from '@faker-js/faker';
const getFakeNodeId = () => `node_${faker.datatype.uuid()}`;
const getFakeNode = nodeId => {
  return {
    type: 'standard',
    title: faker.lorem.words(),
    output: {
      generic: [],
    },
    parent: `node_${faker.datatype.number(9)}_${faker.random.numeric(12)}`,
    context: {},
    next_step: {
      behavior: 'jump_to',
      selector: 'condition',
      dialog_node: `node_${faker.datatype.number(9)}_${faker.random.numeric(12)}`,
    },
    conditions: 'true',
    dialog_node: nodeId,
    previous_sibling: `node_${faker.datatype.number(9)}_${faker.random.numeric(12)}`,
  };
};

const getFakeGetDialogNodeSuccess = nodeId => ({
  status: 200,
  statusText: 'OK',
  result: getFakeNode(nodeId),
});

const getFakeGetDialogNodesFail = nodeId => ({
  statusText: 'Not Found',
  name: 'Not Found',
  status: 404,
  code: 404,
  message: 'Resource not found',
  body: '{"error":"Resource not found","code":404}',
});

export default { getFakeNodeId, getFakeNode, getFakeGetDialogNodeSuccess, getFakeGetDialogNodesFail };
