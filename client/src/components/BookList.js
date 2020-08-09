import React from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'

const GET_BOOKS = gql`
	query GetBooks {
		books {
			name
			id
		}
	}
`

const DELETE_BOOK = gql`
	mutation DeleteBook($id: ID) {
		deleteBook(id: $id) {
			name
			id
		}
	}
`

const BookList = ({ handleClick }) => {
	const { loading, error, data } = useQuery(GET_BOOKS, {
		pollInterval: 500,
	})

	const [deleteBook] = useMutation(DELETE_BOOK)

	const handleDelete = event => {
		deleteBook({ variables: { id: event.target.id } })
		console.log(data.books.find(book => book.id === event.target.id).name)
	}

	if (loading) return <p>Loading...</p>
	if (error) return <p>Uh oh. Something went wrong :(</p>

	return (
		<ul className="book-list">
			{data.books.map(book => (
				<li className="list-item" key={book.id}>
					<button id={book.id} onClick={handleClick}>
						{book.name}
					</button>
					<button
						id={book.id}
						onClick={handleDelete}
						className="delete-button"
					>
						X
					</button>
				</li>
			))}
		</ul>
	)
}

export default BookList
