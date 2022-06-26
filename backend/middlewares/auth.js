const jwt = require('jsonwebtoken');
const { ForbiddenError } = require('./errors/errors');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // get authorization from the header by destructuring
  const { authorization } = req.headers;
  // check that the header exists and starts with 'Bearer '

  if (!authorization || !authorization.startsWith('Bearer ')) {

      throw new ForbiddenError('Authorization required' );
  }

   // auth header exists and is in correct format
   // so extract the token from the header
   const token = authorization.replace('Bearer ', '');

   // if token is verified, save the payload
   let payload;
   try {
     payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'not-so-secret-string');
   } catch (err) {
     // otherwise, return an error
      throw new ForbiddenError('Authorization required' );
   }

   /* Save payload to request. This makes the payload available
   to the latter parts of the route. See the `Accessing user
   data with req.user` example for details. */
   req.user = payload;

   // sending the request to the next middleware
   return next();
};
