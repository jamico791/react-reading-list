import React, { useReducer } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'

const GET_AUTHORS = gql`
	query GetAuthors {
		authors {
			name
			id
		}
	}
`

const ADD_BOOK = gql`
	mutation AddBook($name: String, $genre: String, $authorId: ID) {
		addBook(name: $name, genre: $genre, authorId: $authorId) {
			name
			genre
		}
	}
`

const initialState = {
	title: '',
	genre: '',
	author: 'choose',
}

function reducer(state, { field, value }) {
	return {
		...state,
		[field]: value,
	}
}

const BookForm = () => {
	const { loading, error, data } = useQuery(GET_AUTHORS, {
		pollInterval: 500,
	})

	const [addBook] = useMutation(ADD_BOOK)

	const [state, dispatch] = useReducer(reducer, initialState)

	const handleChange = event => {
		const { name: field, value } = event.target
		dispatch({ field, value })
	}

	const handleSubmit = event => {
		event.preventDefault()
		const { title, genre, author } = state
		const id = data.authors.find(person => person.name === author).id
		addBook({ variables: { name: title, genre, authorId: id } })
		dispatch({ field: 'title', value: '' })
		dispatch({ field: 'genre', value: '' })
		dispatch({ field: 'author', value: 'choose' })
	}

	const { title, genre, author } = state

	if (loading) return null
	if (error) return null

	return (
		<form className="six columns" onSubmit={handleSubmit}>
			<h3>Add a Book</h3>
			<div className="row">
				<div className="four columns">
					<label htmlFor="title">Title</label>
					<input
						dk
						className="u-full-width"
						type="text"
						placeholder="Book Title"
						value={title}
						name="title"
						id="title"
						required
						onChange={handleChange}
						autoComplete="off"
					/>
				</div>
				<div className="four columns">
					<label htmlFor="genre">Genre</label>
					<input
						className="u-full-width"
						type="text"
						placeholder="Genre"
						value={genre}
						name="genre"
						id="genre"
						required
						onChange={handleChange}
						autoComplete="off"
					/>
				</div>
				<div className="four columns">
					<label htmlFor="author">Author</label>
					<select
						className="u-full-width"
						type="text"
						placeholder="Author"
						value={author}
						name="author"
						id="author"
						required
						onChange={handleChange}
					>
						<option value="choose" key="choose" disabled>
							Choose an Author
						</option>
						{data.authors.map(author => (
							<option key={author.id}>{author.name}</option>
						))}
					</select>
				</div>
			</div>
			<div className="row">
				<div className="twelve columns">
					<button className="button-primary u-full-width">
						Submit Book
					</button>
				</div>
			</div>
		</form>
	)
}

export default BookForm
