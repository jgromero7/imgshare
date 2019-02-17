const libs = {};

libs.randomAlphaNum = () => {
    const possible = 'absdefghijklmnopqrstuvwxyz0123456789';
    let randomAlphaNumeric = 0;
    for ( let i = 0; i < 10; i++ ) {
        randomAlphaNumeric += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return randomAlphaNumeric;
}

module.exports = libs;