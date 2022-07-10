const mongoose = require('../db/conn')
const {Schema} = mongoose

const Project = mongoose.model(
    'Project',
    new Schema({
        name: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        },
        documentation: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: true
        },
        tech_used: {
            type: String,
            required: true
        },
    },
    {timestamps: true},
    )
)

module.exports = Project