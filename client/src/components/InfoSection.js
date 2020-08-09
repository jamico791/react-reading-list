import React from 'react'
import { useQuery, gql } from '@apollo/client'

const GET_BOOK = gql`
	query GetBook($currentBook: ID) {
		book(id: $currentBook) {
			name
			genre
			author {
				name
				books {
					name
					id
				}
			}
		}
	}
`

const InfoSection = ({ currentBook }) => {
	const { loading, error, data } = useQuery(GET_BOOK, {
		variables: { currentBook },
		pollInterval: 500,
	})

	if (loading) return <div className="info"></div>
	if (error) return <div className="info"></div>

	return (
		<div className="info">
			<h2>{data.book.name}</h2>
			<h5>By {data.book.author.name}</h5>
			<p>
				<strong>Genre:</strong> {data.book.genre}
			</p>
			<h6>Other books by {data.book.author.name}:</h6>
			<ul>
				{data.book.author.books.map(book => (
					<li key={book.id}>{book.name}</li>
				))}
			</ul>
		</div>
	)
}

export default InfoSection
