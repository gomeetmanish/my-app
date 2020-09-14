import React from 'react';
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
	const initialStories = [
		{
			title: 'React',
			url: 'https://reactjs.org/',
			author: 'Manish',
			num_comments: 3,
			points: 4,
			objectID: 0,
		},
		{
			title: 'Redux',
			url: 'https://reactjs.org/',
			author: 'Kumar',
			num_comments: 2,
			points: 5,
			objectID: 1,
		},
		{
			title: 'Javascript',
			url: 'https://reactjs.org/',
			author: 'Champak',
			num_comments: 8,
			points: 3,
			objectID: 2,
		},
		{
			title: 'Angular',
			url: 'https://reactjs.org/',
			author: 'Borah',
			num_comments: 7,
			points: 2,
			objectID: 4,
		},
	];

	const [searchTerm, setSearchTerm] = React.useState(
		localStorage.getItem('search') || '',
	);
	const [stories, dispatchStories] = React.useReducer(storiesReducer, {
		data: [],
		isLoading: false,
		isError: false,
	});

	React.useEffect(() => {
		dispatchStories({
			type: 'STORIES_FETCH_INIT',
		});

		fetch(`${API_ENDPOINT}react`)
			.then((response) => response.json())
			.then((result) => {
				return dispatchStories({
					type: 'STORIES_FETCH_SUCCESS',
					payload: result.hits,
				});
			})
			.catch(function () {
				return dispatchStories({
					type: 'STORIES_FETCH_FAILURE',
				});
			});
	}, []);

	React.useEffect(() => {
		localStorage.setItem('search', searchTerm);
	}, [searchTerm]);

	function getAsyncStories() {
		return new Promise(function (resolve) {
			return setTimeout(function () {
				return resolve({ data: { stories: initialStories } });
			}, 1000);
		});
	}

	const handleRemoveStory = (item) => {
		dispatchStories({
			type: 'REMOVE_STORY',
			payload: item,
		});
	};

	const handleSearch = (ev) => {
		setSearchTerm(ev.target.value);
	};

	const searchedStories = stories.data.filter((story) =>
		story.title.toLowerCase().includes(searchTerm.toLowerCase()),
	);

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

	return (
		<>
			<h1>My Hacker Stories</h1>
			<InputWithLabel
				id='search'
				value={searchTerm}
				onInputChange={handleSearch}
				isFocused
			>
				<strong>Search:</strong>
			</InputWithLabel>
			<hr />
			{stories.isError && <p>Something went wrong...</p>}
			{stories.isLoading ? (
				<p>Loading...</p>
			) : (
				<List list={searchedStories} onRemoveItem={handleRemoveStory} />
			)}
		</>
	);
};

export default App;
