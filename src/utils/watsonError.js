export class WatsonError extends Error {
  constructor({ env, country, message }) {
    super(message);
    this.env = env;
    this.country = country;
  }
}

export class NodeNotFoundError extends Error {
  constructor({ env, country, nodeId }) {
    super(`Node ID ${nodeId} not found in ${country}, env ${env}`);
    this.env = env;
    this.country = country;
  }
}

export class NodeListNotFoundError extends Error {
  constructor({ env, country }) {
    super(`Node list not found in ${country}, env ${env}`);
    this.env = env;
    this.country = country;
  }
}

export class NodeNameNotFoundError extends Error {
  constructor({ env, country, name = '' }) {
    super(`Node name ${name} not found in ${country}, env ${env}`);
    this.env = env;
    this.country = country;
    this.name = name;
  }
}
