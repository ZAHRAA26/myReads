import React, { useState, useEffect } from "react";
import "./App.css";
import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import BookShelf from "./components/BookShelf";
import Search from "./components/Search";

function BooksApp() {
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [wantToRead, setWantToRead] = useState([]);
  const [read, setRead] = useState([]);

  // search
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // تحميل الكتب
  useEffect(() => {
    BooksAPI.getAll().then((books) => {
      setCurrentlyReading(
        books.filter((book) => book.shelf === "currentlyReading")
      );
      setWantToRead(
        books.filter((book) => book.shelf === "wantToRead")
      );
      setRead(
        books.filter((book) => book.shelf === "read")
      );
    });
  }, []);

  const removeBook = (book) => {
    if (book.shelf === "currentlyReading") {
      setCurrentlyReading((prev) =>
        prev.filter((b) => b.id !== book.id)
      );
    }
    if (book.shelf === "wantToRead") {
      setWantToRead((prev) =>
        prev.filter((b) => b.id !== book.id)
      );
    }
    if (book.shelf === "read") {
      setRead((prev) =>
        prev.filter((b) => b.id !== book.id)
      );
    }
  };

  const changeShelf = (book, newShelf) => {
    BooksAPI.update(book, newShelf).then(() => {
      removeBook(book);
      book.shelf = newShelf;

      if (newShelf === "currentlyReading") {
        setCurrentlyReading((prev) => [...prev, book]);
      } else if (newShelf === "wantToRead") {
        setWantToRead((prev) => [...prev, book]);
      } else if (newShelf === "read") {
        setRead((prev) => [...prev, book]);
      }
    });
  };

  return (
    <div className="app">
      <Switch>
        <Route
          exact
          path="/search"
          render={() => (
            <div className="search-books">
              <Search
                changeShelf={changeShelf}
                read={read}
                currentlyReading={currentlyReading}
                wantToRead={wantToRead}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                debouncedSearchTerm={debouncedSearchTerm}
              />
            </div>
          )}
        />

        <Route
          path="/"
          render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>

              <div className="list-books-content">
                <BookShelf
                  shelfName="Currently Reading"
                  books={currentlyReading}
                  changeShelf={changeShelf}
                />

                <BookShelf
                  shelfName="Read"
                  books={read}
                  changeShelf={changeShelf}
                />

                <BookShelf
                  shelfName="Want To Read"
                  books={wantToRead}
                  changeShelf={changeShelf}
                />
              </div>

              <div className="open-search">
                <Link to="/search">Add a book</Link>
              </div>
            </div>
          )}
        />
      </Switch>
    </div>
  );
}

export default BooksApp;