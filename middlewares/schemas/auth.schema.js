import joi from 'joi';

export default {
    login: joi.object({
        email: joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } })
            .required(),

        password: joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .required()

    }),
    register: joi.object({
        username: joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required(),

        fullname: joi.string()
            .min(3)
            .max(100)
            .required(),

        email: joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } })
            .required(),

        password: joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .required()
    }),
    changePassword: joi.object({
        oldPassword: joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .required(),
        newPassword: joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
            .required(),

    }),
}