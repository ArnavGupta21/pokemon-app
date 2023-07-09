import React from "react";
import { Form, Row, Container, Col, Button } from "react-bootstrap";

const Search = (props) => {
	const [search, setSearch] = React.useState("");

	const handleSearchChange = (e) => {
		setSearch(e.target.value.toLowerCase());
	};

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		props.getPokemon(search);
	};

	return (
		<Container>
			<Form className='mt-2' onSubmit={handleSearchSubmit}>
				<Row className='align-items-center'>
					<Col sm={10} className='my-1'>
						<Form.Control onChange={handleSearchChange} placeholder='Search for Pokemon' />
					</Col>
					<Col sm={2} className='my-1'>
						<Button block type='submit'>
							Search
						</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	);
};

export default Search;
