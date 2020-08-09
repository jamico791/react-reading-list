const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { graphqlHTTP } = require('express-graphql')
const { schema, root } = require('./schema/schema')

const app = express()
const port = 4000

app.use(cors())

const uri =
	'mongodb+srv://John:ThbEoVMQwPeaezOJ@cluster0.rxesa.mongodb.net/gql-ninja?retryWrites=true&w=majority'

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
	console.log('Connection Made')
})

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		rootValue: root,
		graphiql: true,
	})
)

app.listen(port, console.log(`Listening on port ${port}`))
