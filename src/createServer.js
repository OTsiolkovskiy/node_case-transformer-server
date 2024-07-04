const http = require('http');
const { convertToCase } = require('./convertToCase');

const supportedCases = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];

function createServer() {
  return http.createServer((req, res) => {
    const [path, queryString] = req.url.split('?');

    const textToConvert = path.slice(1);
    const params = new URLSearchParams(queryString);
    const toCase = params.get('toCase');

    const errors = [];

    if (!textToConvert) {
      errors.push({
        // eslint-disable-next-line
        message: 'Text to convert is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".'
      });
    }

    if (!toCase) {
      errors.push({
        // eslint-disable-next-line
        message: '"toCase" query param is required. Correct request is: "/<TEXT_TO_CONVERT>?toCase=<CASE_NAME>".'
      });
    } else if (!supportedCases.includes(toCase)) {
      errors.push({
        // eslint-disable-next-line
        message: 'This case is not supported. Available cases: SNAKE, KEBAB, CAMEL, PASCAL, UPPER.'
      });
    }

    res.setHeader('Content-Type', 'application/json');

    if (errors.length > 0) {
      res.writeHead(400);
      res.end(JSON.stringify({ errors }));

      return;
    }

    const result = convertToCase(textToConvert, toCase);

    res.writeHead(200);

    res.end(
      JSON.stringify({
        originalCase: result.originalCase,
        targetCase: toCase,
        originalText: textToConvert,
        convertedText: result.convertedText,
      }),
    );
  });
}

module.exports = {
  createServer,
};
