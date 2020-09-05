import React from 'react';
import './App.css';

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

const App = () => {
	const [searchTerm, setSearchTerm] = React.useState(
		localStorage.getItem('search') || '',
	);

	const [stories, setStories] = React.useState(initialStories);

	React.useEffect(() => {
		localStorage.setItem('search', searchTerm);
	}, [searchTerm]);

	const handleRemoveStory = (item) => {
		const newStories = stories.filter(
			(story) => item.objectID !== story.objectID,
		);
		setStories(newStories);
	};

	const handleSearch = (ev) => {
		setSearchTerm(ev.target.value);
	};

	const searchedStories = stories.filter((terms) => {
		return terms.title.toLowerCase().includes(searchTerm.toLowerCase());
	});

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
			<List list={searchedStories} onRemoveItem={handleRemoveStory} />
		</>
	);
};

export default App;
