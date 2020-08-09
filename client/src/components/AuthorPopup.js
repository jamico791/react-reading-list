import React, { useState } from 'react'
import { useMutation, useQuery, gql } from '@apollo/client'

const GET_AUTHORS = gql`
	query GetAuthors {
		authors {
			name
			id
		}
	}
`
const DELETE_AUTHOR = gql`
	mutation DeleteAuthor($id: ID) {
		deleteAuthor(id: $id) {
			name
			id
		}
	}
`

const AuthorPopup = ({ show, setShow }) => {
	const { loading, error, data } = useQuery(GET_AUTHORS)
	const [deleteAuthor] = useMutation(DELETE_AUTHOR)
	const [chosenAuthor, setChosenAuthor] = useState('choose')

	const handleChange = event => {
		setChosenAuthor(event.target.value)
	}

	const handleCancel = () => {
		setShow(false)
		setChosenAuthor('choose')
	}

	const handleDelete = () => {
		deleteAuthor({ variables: { id: chosenAuthor } })
		setShow(false)
		setChosenAuthor('choose')
	}

	if (loading) return null
	if (error) return null
	return (
		<div className={show ? 'shown' : 'hidden'}>
			<select
				value={chosenAuthor}
				onChange={handleChange}
				className="three columns"
			>
				<option value="choose" key="choose" disabled>
					Choose an Author
				</option>
				{data.authors.map(author => (
					<option value={author.id} key={author.id}>
						{author.name}
					</option>
				))}
			</select>
			<button
				type="button"
				className="delete-button"
				onClick={handleDelete}
			>
				X
			</button>
			<button
				type="button"
				className="cancel-button"
				onClick={handleCancel}
			>
				Cancel
			</button>
		</div>
	)
}

export default AuthorPopup
