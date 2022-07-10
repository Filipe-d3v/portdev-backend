const mongoose = require('../db/conn')
const { Schema } = mongoose

const Skill = mongoose.model(
    'Skill',
    new Schema({
        name: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true,
            default: 0
        },
        icon: {
            type: String,
            required: true
        },
    },
    {timestamps: true}
    )
)

module.exports = Skill