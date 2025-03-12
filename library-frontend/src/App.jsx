import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Home from './components/Home';
import { useState } from 'react';
import Loginform from './components/Loginform';
import { useApolloClient, useSubscription } from '@apollo/client';
import Recommends from './components/Recommends';
import { ALL_BOOKS, BOOK_ADDED } from './services/queries';

const updateCache = (cache, query, addedBook) => {
  const uniqueByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.name;
      return seen.has(k) ? false : seen.add(k);
    });
  };

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqueByName(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [token, setToken] = useState(null);
  const client = useApolloClient();
  
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`${addedBook.name} added`);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    }
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
        <nav style={{ marginBottom: '20px' }}>
          <Link to='/authors' style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>authors</Link>
          <Link to='/books' style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>books</Link>
          {token ? (
            <>
              <Link to='/create' style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>add Book</Link>
              <Link to='/recommend' style={{ marginRight: '10px', textDecoration: 'none', color: 'blue' }}>recommend</Link>
              <button onClick={logout} style={{ textDecoration: 'none', color: 'blue' }} type='submit'>logout</button>
            </>
          ) : (
            <Link to='/login' style={{ textDecoration: 'none', color: 'blue' }}>login</Link>
          )}
        </nav>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/login" element={<Loginform  setToken={setToken} />} />
          <Route path="/books" element={<Books />} />
          <Route path="/recommend" element={<Recommends />} />
          <Route path="/create" element={<NewBook />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
