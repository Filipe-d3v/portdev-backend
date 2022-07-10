const mongoose = require('mongoose')

async function main() {
    await mongoose.connect('mongodb+srv://Filipe:7jgXAYD0UkJNmqIQ@port-dev-cluster.dg5b439.mongodb.net/?retryWrites=true&w=majority')
    console.log('Connected to DB!')
}
main().catch(err => console.log(err))

module.exports = mongoose