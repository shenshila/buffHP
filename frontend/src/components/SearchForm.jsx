// SearchForm.jsx
import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

const SearchForm = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Введите имя или фамилию"
          required
        />
        <Button variant="primary" type="submit">
          Найти
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchForm;