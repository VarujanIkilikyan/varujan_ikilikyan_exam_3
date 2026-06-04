import joi from 'joi';

export default {
    addFilm: joi.object({
        title: joi.string()
            .min(1)
            .max(255)
            .trim()
            .required(),

        description: joi.string()
            .min(1)
            .max(1000)
            .trim()
            .required(),

        genre: joi.array()
            .items(joi.string().trim().min(2).max(50))
            .min(1)
            .required(),

        duration: joi.number()
            .integer()
            .positive()
            .min(1)
            .max(500)
            .required()

    }),
    updateFilm: joi.object({
        title: joi.string()
            .min(1)
            .max(255)
            .trim()
            .optional(),

        description: joi.string()
            .min(1)
            .max(1000)
            .trim()
            .optional(),

        genre: joi.array()
            .items(joi.string().trim().min(2).max(50))
            .min(1)
            .optional(),

        duration: joi.number()
            .integer()
            .positive()
            .min(1)
            .max(500)
            .optional()


    }),
    validID: joi.object({
        id: joi.number()
            .integer()
            .positive()
            .required()
    }),

}