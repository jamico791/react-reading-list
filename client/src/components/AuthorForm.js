import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import AuthorPopup from './AuthorPopup'

const ADD_Author = gql`
	mutation AddAuthor($name: String!) {
		addAuthor(name: $name) {
			name
		}
	}
`

const AuthorForm = () => {
	const [name, setName] = useState('')
	const [show, setShow] = useState(false)
	const [addAuthor] = useMutation(ADD_Author)

	const handleChange = event => {
		setName(event.target.value)
	}

	const handleShow = () => {
		setShow(true)
	}

	const handleSubmit = event => {
		event.preventDefault()
		addAuthor({ variables: { name } })
		setName('')
	}

	return (
		<form onSubmit={handleSubmit} className="six columns">
			<div className="row">
				<h3 className="six columns">Add an Author</h3>
				<button
					type="button"
					className={'six columns ' + (show ? 'hidden' : 'shown')}
					onClick={handleShow}
				>
					Remove Author
				</button>
				<AuthorPopup show={show} setShow={setShow} />
			</div>
			<div className="twelve columns">
				<label htmlFor="name">Name</label>
				<input
					className="u-full-width"
					placeholder="Name"
					value={name}
					type="text"
					required
					onChange={handleChange}
				/>
			</div>
			<button className="row u-full-width button-primary">
				Submit Author
			</button>
		</form>
	)
}

export default AuthorForm
