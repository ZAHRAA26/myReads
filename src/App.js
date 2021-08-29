import React from "react";
import "./App.css";
import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import BookShelf from "./components/BookShelf";
import Search from "./components/Search";

// import { object } from "prop-types";
// import * as BooksAPI from "./BooksAPI";
class BooksApp extends React.Component {
  _isMounted = false;
  state = {
    query: "",
    currentlyReading: [],
    read: [],
    wantToRead: [],
  };

  async componentDidMount() {
    this._isMounted = true;
    const books = await BooksAPI.getAll();

    const currentlyReading = books.filter(
      (book) => book.shelf === "currentlyReading"
    );
    const wantToRead = books.filter((book) => book.shelf === "wantToRead");
    const read = books.filter((book) => book.shelf === "read");
    this.setState({ currentlyReading, wantToRead, read });
  }

  removeBook = (book) => {
    const bookShelf = book.shelf;
    const stateObject = Object.assign({}, this.state);
    for (const [key, value] of Object.entries(stateObject)) {
      if (key === bookShelf) {
        for (const v of value) {
          if (v.id === book.id) {
            value.splice(value.indexOf(v, 0), 1);
          }
        }
      }
      this.setState({
        ...stateObject,
      });
    }
  };

  changeShelf = (book, newShelf) => {
    BooksAPI.update(book, newShelf).then(() => {
      this.removeBook(book);
      book.shelf = newShelf;
      switch (newShelf) {
        case "none": {
          break;
        }
        case "currentlyReading": {
          this.setState({
            currentlyReading: this.state.currentlyReading
              .filter((oldbook) => oldbook.id !== book.id)
              .concat(book),
          });
          break;
        }
        case "wantToRead": {
          this.setState({
            wantToRead: this.state.wantToRead
              .filter((oldbook) => oldbook.id !== book.id)
              .concat(book),
          });
          break;
        }
        case "read": {
          this.setState({
            read: this.state.read
              .filter((oldbook) => oldbook.id !== book.id)
              .concat(book),
          });
          break;
        }
        default:
          return this.state;
      }
    });
  };

  render() {
    const { read, currentlyReading, wantToRead } = this.state;
    return (
      <div className="app">
        <Switch>
          <Route
            exact
            path="/search"
            render={() => (
              <div className="search-books">
                <Search
                  changeShelf={this.changeShelf}
                  read={read}
                  currentlyReading={currentlyReading}
                  wantToRead={wantToRead}
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
                    shelfName={"currently reading"}
                    books={currentlyReading}
                    changeShelf={this.changeShelf}
                  />
                  <BookShelf
                    shelfName={"Read"}
                    books={read}
                    changeShelf={this.changeShelf}
                  />
                  <BookShelf
                    shelfName={"Want to Read"}
                    books={wantToRead}
                    changeShelf={this.changeShelf}
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
}
export default BooksApp;
