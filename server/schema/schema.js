const { buildSchema } = require('graphql')
const Book = require('../models/book')
const Author = require('../models/author')

const schema = buildSchema(`
    type BookType {
        name: String!
        genre: String!
        id: ID!
        authorId: ID!
        author: AuthorType
    }

    type AuthorType {
        name: String!
        id: ID!
        books: [BookType]
    }
	
	type Mutation {
		addBook(name: String, genre: String, authorId: ID): BookType
		addAuthor(name: String): AuthorType
		deleteBook(id: ID): BookType
		deleteAuthor(id: ID): AuthorType
	}

    type Query {
        book(id: ID): BookType
        author(id: ID): AuthorType
		books: [BookType]
		authors: [AuthorType]
	}
`)

class BookType {
	constructor(name, genre, id, authorId) {
		this.name = name
		this.genre = genre
		this.id = id
		this.authorId = authorId
	}

	async author() {
		const { name, id } = await Author.findById(this.authorId)
		return new AuthorType(name, id)
	}
}

class AuthorType {
	constructor(name, id) {
		this.name = name
		this.id = id
	}

	async books() {
		return await (await Book.find({}))
			.filter(book => book.authorId === this.id)
			.sort((a, b) => {
				const bookA = a.name.toUpperCase()
				const bookB = b.name.toUpperCase()
				if (bookA < bookB) return -1
				if (bookA > bookB) return 1
				return 0
			})
	}
}

const root = {
	book: async args => {
		const { name, genre, id, authorId } = await Book.findById(args.id)
		return new BookType(name, genre, id, authorId)
	},
	author: async args => {
		const { name, id } = await Author.findById(args.id)
		return new AuthorType(name, id)
	},
	books: async () => {
		const allBooks = await (await Book.find({})).sort((a, b) => {
			const bookA = a.name.toUpperCase()
			const bookB = b.name.toUpperCase()
			if (bookA < bookB) return -1
			if (bookA > bookB) return 1
			return 0
		})
		const preparedBooks = []
		for (let i = 0; i < allBooks.length; i++) {
			const { name, genre, id, authorId } = allBooks[i]
			preparedBooks.push(new BookType(name, genre, id, authorId))
		}
		return preparedBooks
	},
	authors: async () => {
		const allAuthors = await (await Author.find({})).sort((a, b) => {
			const nameA = a.name.split(' ')[1].toUpperCase()
			const nameB = b.name.split(' ')[1].toUpperCase()
			if (nameA < nameB) return -1
			if (nameA > nameB) return 1
			return 0
		})
		const preparedAuthors = []
		for (let i = 0; i < allAuthors.length; i++) {
			const { name, id } = allAuthors[i]
			preparedAuthors.push(new AuthorType(name, id))
		}
		return preparedAuthors
	},
	addBook: args => {
		const { name, genre, authorId } = args
		const book = new Book({
			name,
			genre,
			authorId,
		})
		book.save()
		return args
	},
	addAuthor: args => {
		const { name } = args
		const author = new Author({ name })
		author.save()
		return args
	},
	deleteBook: async args => {
		Book.findByIdAndDelete(args.id, (err, docs) => {
			if (err) console.log(err)
			else console.log('Deleted: ', docs)
		})
	},
	deleteAuthor: async args => {
		Author.findByIdAndDelete(args.id, (err, docs) => {
			if (err) console.log(err)
			else console.log('Deleted: ', docs)
		})
	},
}

module.exports = {
	schema,
	root,
}
