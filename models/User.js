const mongoose = require('../db/conn')

const { Schema } = mongoose

const User = mongoose.model(
    'User',
    new Schema({
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        birth: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        address: {
            type: String,
            reqruired: true
        },
        cep: {
            type: String,
            reqruired: true
        },
        city: {
            type: String,
            reqruired: true
        },
        uf: {
            type: String,
            reqruired: true
        },
        skills: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill'
        }],
        password: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },
    },
    {timestamps: true}
    )
)

module.exports = User