const jwtDecode = require('jwt-decode');

exports.getUserId = function (event) {
    const authorizationHeader = event.headers.authorization || '';
    const TokenArray = authorizationHeader.split(' ');

    if (TokenArray.length !== 2)
        throw new Error(`header is invalid: ${authorizationHeader}`);

    const decodedHeader = jwtDecode(TokenArray[1]);
    return decodedHeader.sub;
}
