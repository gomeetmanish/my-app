import React from 'react';
import axios from 'axios';
import './App.css';

const storiesReducer = (state, action) => {
	switch (action.type) {
		case 'STORIES_FETCH_INIT':
			return {
				...state,
				isLoading: true,
				isError: false,
			};
		case 'STORIES_FETCH_SUCCESS':
			return {
				...state,
				isLoading: false,
				isError: false,
				data: action.payload,
			};
		case 'STORIES_FETCH_FAILURE':
			return {
				...state,
				isLoading: false,
				isError: true,
			};
		case 'REMOVE_STORY':
			return {
				...state,
				data: state.data.filter(
					(story) => action.payload.objectID !== story.objectID,
				),
			};
		default:
			throw new Error('ACTION NOT HANDLED');
	}
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {
	const [searchTerm, setSearchTerm] = React.useState(
		localStorage.getItem('search') || '',
	);
	const [stories, dispatchStories] = React.useReducer(storiesReducer, {
		data: [],
		isLoading: false,
		isError: false,
	});
	const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

	const handleFetchStories = React.useCallback(async () => {
		dispatchStories({
			type: 'STORIES_FETCH_INIT',
		});

		try {
			const result = await axios.get(url);
			dispatchStories({
				type: 'STORIES_FETCH_SUCCESS',
				payload: result.data.hits,
			});
		} catch {
			dispatchStories({
				type: 'STORIES_FETCH_FAILURE',
			});
		}
	}, [url]);

	React.useEffect(() => {
		handleFetchStories();
	}, [handleFetchStories]);

	React.useEffect(() => {
		localStorage.setItem('search', searchTerm);
	}, [searchTerm]);

	const handleRemoveStory = (item) => {
		dispatchStories({
			type: 'REMOVE_STORY',
			payload: item,
		});
	};

	const handleSearchInput = (ev) => {
		setSearchTerm(ev.target.value);
	};

	const handleSearchSubmit = () => {
		setUrl(`${API_ENDPOINT}${searchTerm}`);
	};

	const Item = ({ onRemoveItem, item }) => {
		const { url, title, author, num_comments, points } = item;
		return (
			<div>
				<span>
					<a href={url}>{title}</a>
				</span>
				<span>{author}</span>
				<span>{num_comments}</span>
				<span>{points}</span>
				&nbsp;
				<span>
					<button type='button' onClick={() => onRemoveItem(item)}>
						Dismiss
					</button>
				</span>
			</div>
		);
	};

	const List = ({ list, onRemoveItem }) =>
		list.map((item) => (
			<Item onRemoveItem={onRemoveItem} item={item} key={item.objectID} />
		));

	const InputWithLabel = ({
		id,
		value,
		type = 'text',
		isFocused,
		onInputChange,
		children,
	}) => {
		const inputRef = React.useRef();
		React.useEffect(() => {
			if (isFocused && inputRef.current) {
				inputRef.current.focus();
			}
		}, [isFocused]);

		return (
			<>
				<label htmlFor={id}>{children}</label>
				&nbsp;
				<input
					id={id}
					type={type}
					value={value}
					ref={inputRef}
					placeholder='Search'
					onChange={onInputChange}
				/>
			</>
		);
	};

	const SearchFormComponent = ({
		onSearchInput,
		onSearchSubmit,
		searchTerm,
	}) => {
		return (
			<form onSubmit={onSearchSubmit}>
				<InputWithLabel
					id='search'
					value={searchTerm}
					onInputChange={onSearchInput}
					isFocused
				>
					<strong>Search:</strong>
				</InputWithLabel>
				<button type='submit' disabled={!searchTerm}>
					Submit
				</button>
			</form>
		);
	};

	return (
		<>
			<h1>My Hacker Stories</h1>
			<SearchFormComponent
				onSearchInput={handleSearchInput}
				onSearchSubmit={handleSearchSubmit}
				searchTerm={searchTerm}
			/>
			<hr />
			{stories.isError && <p>Something went wrong...</p>}
			{stories.isLoading ? (
				<p>Loading...</p>
			) : (
				<List list={stories.data} onRemoveItem={handleRemoveStory} />
			)}
		</>
	);
};

export default App;
