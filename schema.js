const Joi = require('joi');

module.exports.listingSchema=Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        desc:Joi.string().required(),
        image:Joi.string().allow("",null),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required(),category: Joi.string()
      .valid(
        "trending",
        "bedrooms",
        "mountains",
        "castle",
        "forest",
        "artic",
        "amazingpool",
        "musicnight",
        "dome",
        "boating"
      ).required()
    })
}).required();

module.exports.reviewSchema = Joi.object({
    list: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required()
    }).required()
});

//this is done for the server side validation