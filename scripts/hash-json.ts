const {createHmac} = require('node:crypto');

export const hashJSON = (json: {[s: string]: any}): string => {
  return hashText(JSON.stringify(json));
};

export const hashText = (text: string): string => {
  const hmac = createHmac('sha256', 'a secret');
  hmac.update(text);
  return hmac.digest('hex');
};
