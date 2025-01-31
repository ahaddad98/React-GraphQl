import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';
import './App.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

const GET_USERS = gql`
  query {
    users {
      name
      age
    }
  }
`;

const ADD_USER = gql`
  mutation AddUser($name: String!, $age: Int!) {
    addUser(name: $name, age: $age) {
      name
      age
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($name: String!, $age: Int!) {
    updateUser(name: $name, age: $age) {
      name
      age
    }
  }
`;

function UsersList() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [addUser] = useMutation(ADD_USER);
  const [updateUser] = useMutation(UPDATE_USER);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updateAge, setUpdateAge] = useState('');

  if (loading) return <p className="loading">Loading users...</p>;
  if (error) return <p className="error">Error: {error.message}</p>;

  const handleAddUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    try {
      await addUser({ variables: { name, age: parseInt(age) } });
      refetch();
      setName('');
      setAge('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    try {
      await updateUser({ variables: { name: updateName, age: parseInt(updateAge) } });
      refetch();
      setUpdateName('');
      setUpdateAge('');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Users List</h2>
      <ul className="user-list">
        {data.users.map((user, index) => (
          <li key={index} className="user-item">
            <strong>{user.name}</strong> - {user.age} years old
          </li>
        ))}
      </ul>

      <form className="form-container" onSubmit={handleAddUser}>
        <h3>Add User</h3>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <button type="submit" className="btn">Add User</button>
      </form>

      <form className="form-container" onSubmit={handleUpdateUser}>
        <h3>Update User</h3>
        <input
          type="text"
          placeholder="Existing Name"
          value={updateName}
          onChange={(e) => setUpdateName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="New Age"
          value={updateAge}
          onChange={(e) => setUpdateAge(e.target.value)}
          required
        />
        <button type="submit" className="btn">Update User</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <UsersList />
      </div>
    </ApolloProvider>
  );
}

export default App;
