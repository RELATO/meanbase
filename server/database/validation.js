var validate = require('mongoose-validator');

module.exports = function() {
    var validations = {};

    validations.url = [
        validate({
            validator: 'isURL',
            passIfEmpty: true,
            arguments: {require_tld: false, allow_underscores: true},
            message: 'The url you provided is invalid.'
        })
    ];

    validations.ip = [
        validate({
            validator: 'isIP',
            message: 'The ip is invalid.'
        })
    ];

    validations.email = [
        validate({
            validator: 'isEmail',
            passIfEmpty: true,
            message: 'That email is invalid.'
        })
    ];

    validations.username = [
        validate({
            validator: 'matches',
            passIfEmpty: true,
            arguments: /^([a-zA-Z])[a-zA-Z_-]*[\w_-]*[\S]$|^([a-zA-Z])[0-9_-]*[\S]$|^[a-zA-Z]*[\S]$/,
            message: 'Username must start with a letter and can contain no special characters expect and underscore (_) or dash (-). Otherwise numbers and letters are permitted.'
        })
    ];

    validations.password = [
        validate({
            validator: 'matches',
            passIfEmpty: true,
            arguments: /^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/,
            message: 'Password must contain at least one letter, at least one number, and be longer than six charaters.'
        })
    ];







    return validations;
};

