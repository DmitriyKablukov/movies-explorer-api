const allowedCors = [
  'https://api.movies-exp.nomoredomainsmonster.ru/',
  'http://api.movies-exp.nomoredomainsmonster.ru/',
  'https://movies-exp.nomoredomainsmonster.ru/',
  'http://movies-exp.nomoredomainsmonster.ru/',
  'http://158.160.132.196',
  'https://158.160.132.196',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://localhost:3000',
  'https://localhost:3001',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};
