import React, { useState } from 'react'
import './App.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

// components
import BookList from './components/BookList'
import InfoSection from './components/InfoSection'
import BookForm from './components/BookForm'
import AuthorForm from './components/AuthorForm'

// setup apollo client
const client = new ApolloClient({
	uri: 'http://localhost:4000/graphql',
	cache: new InMemoryCache(),
})

function App() {
	const [currentBook, setCurrentBook] = useState('')
	const handleClick = event => {
		setCurrentBook(event.target.id)
	}
	return (
		<ApolloProvider client={client}>
			<div className="App">
				<h1 className="title">John's Reading List</h1>
				<div className="content">
					<BookList handleClick={handleClick} />
					<InfoSection currentBook={currentBook} />
				</div>
				<div className="form-section">
					<BookForm />
					<AuthorForm />
				</div>
			</div>
		</ApolloProvider>
	)
}

export default App
