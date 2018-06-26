(function () {
  // Constructor Book
  function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }

  // Constructor UI
  function UI() {
  }

  UI.prototype = {
    addBookToList: function (book) {

      const list = document.getElementById('book-list');

      // Create tr element
      const row = document.createElement('tr');

      // Insert cols
      row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td><a href="#" class="delete">X</a></td>
            `;
      list.appendChild(row);
    },

    // Show alert
    showAlert: function (message, className) {
      // Create div
      const div = document.createElement('div');
      div.className = `alert ${className}`;
      // Add text
      div.appendChild(document.createTextNode(message));
      // Get parent
      const container = document.querySelector('.container');
      // Get form
      const form = document.querySelector('#book-form');
      // Insert alert
      container.insertBefore(div, form)

      // Timeout after 3 sec
      setTimeout(function () {
        document.querySelector('.alert').remove();
      }, 3000)
    },

    // Delete book
    deleteBook: function (target) {
      if (target.className === 'delete') {
        target.parentElement.parentElement.remove();
      }
    },

    // Clear fields
    clearFields: function () {
      document.getElementById('title').value = '';
      document.getElementById('author').value = '';
      document.getElementById('isbn').value = '';
    }
  };

  // Local Storage

  function Store() {
    this.books = [];
  }

  Store.prototype = {
    getBooks: function () {
      if (localStorage.getItem('books') === null) {
        this.books = [];
      } else {
        this.books = JSON.parse(localStorage.getItem('books'));
      }
      return this.books;
    },

    displayBooks: function () {
      const books = this.getBooks;
      books.forEach(function (book) {
        const ui = new UI;

        // Add book to UI
        ui.addBookToList(book);
      })
    },

    addBook: function (book) {
      const books = this.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
    },

    removeBook: function (isbn) {
      const books = this.getBooks();
      books.forEach(function (book, index) {
        if (book.isbn === isbn) {
          books.splice(index, 1)
        }
      });
      localStorage.setItem('books', JSON.stringify(books));
    }
  };

  // DOM Load Event
  document.addEventListener('DOMContentLoaded', this.displayBooks);

  // Event listeners
  document.getElementById('book-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const title = document.getElementById('title').value,
      author = document.getElementById('author').value,
      isbn = document.getElementById('isbn').value;

    // Instance book
    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();

    // Instantiate Sotrage
    const store = new Store();

    if (title === '' || author === '' || isbn === '') {
      // Error lert
      ui.showAlert('Please fill in all fields', 'error');
    } else {
      // Add book to list
      ui.addBookToList(book);

      // Add book to Local Storage
      store.addBook(book);

      // Show success
      ui.showAlert('Book added', 'success');

      // Cleat fields
      ui.clearFields();
    }
  });

  // Event listener for delete
  document.getElementById('book-list').addEventListener('click', function (e) {
    e.preventDefault();

    // Instantiate UI
    const ui = new UI();

    // Instantiate Sotrage
    const store = new Store();

    // Delete book
    ui.deleteBook(e.target);

    // Remove book from Local Storage
    store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show alert
    ui.showAlert('Book Removed', 'success');

  })
})();
