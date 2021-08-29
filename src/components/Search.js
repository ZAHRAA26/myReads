import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import * as BooksAPI from "../BooksAPI";
import Book from "./Book";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      searchResult: [],
      searchError: false,
    };
  }
  static propTypes = {
    changeShelf: PropTypes.func.isRequired,
    read: PropTypes.array.isRequired,
    currentlyReading: PropTypes.array.isRequired,
    wantToRead: PropTypes.array.isRequired,
  };
  checkBookExist = (books) => {
    const { read, currentlyReading, wantToRead } = this.props;
    const mainPageBooks = [...read, ...currentlyReading, ...wantToRead];
    if (books.length > 0) {
      for (const book of mainPageBooks) {
        books
          .filter((b) => b.id === book.id)
          .map((b) => (b.shelf = book.shelf));
      }

      this.setState({
        searchResult: books,
        searchError: false,
      });
    } else {
      this.setState({
        searchResult: [],
        searchError: true,
      });
    }
  };

  handleInputSearch = () => {
    const inputSearch = document.getElementById("inputSearch").value;
    this.setState(() => ({
      query: inputSearch.trim(),
    }));
    this.setState({ query: inputSearch });
    if (inputSearch !== "") this.searchBook(inputSearch);
  };

  searchBook(inputSearch) {
    const { searchResult } = this.state;
    BooksAPI.search(inputSearch, 20).then((books) => {
      this.checkBookExist(books);
      if (this.state.query === "")
        this.setState({
          searchResult: [],
        });
      return searchResult;
    });
  }

  render() {
    const { query, searchResult, searchError } = this.state;
    const { changeShelf } = this.props;
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">
            close
          </Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              id="inputSearch"
              onChange={this.handleInputSearch}
            />
          </div>
        </div>
        <div className="search-books-results">
          {searchResult.length > 0 && query !== "" ? (
            <ol className="books-grid">
              {searchResult.map((book) => (
                <Book
                  book={book}
                  key={book.id}
                  changeShelf={changeShelf}
                  shelf={book.shelf}
                />
              ))}
            </ol>
          ) : searchError === true && query !== "" ? (
            <p id="noSearch">
              Sorry!,there is no result for your enterd words:(
            </p>
          ) : (
            <p id="noSearch">Search Result Will Be Shown Here</p>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Search);
