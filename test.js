const crypto = require('crypto');

function generateToken(email) {
    return crypto.createHash('sha256').update(email).digest('hex');
}

console.log(generateToken("ng.hiep0822@gmail.com"));