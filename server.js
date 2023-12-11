const express = require('express');
const app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
const port = 8000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let Home = require('./pages/home');
let Books = require('./pages/books');
let BooksStatus = require('./pages/books_status');
let Authors = require('./pages/authors');
let BookDetails = require('./pages/book_details');
let CreateBook = require('./pages/create_book');


let mongoose = require('mongoose');
let mongoDB = "mongodb://127.0.0.1:27017/my_library_db";
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', function() {
  console.log('Connected to database');
});
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.json());


app.get('/home', (req, res) => {
  Home.show_home(res);
})


app.get('/homeaInfo', (req, res) => {
  Home.show_homeInfo(res);
})


app.get('/available', (req, res) => {
  BooksStatus.show_all_books_status(res);
})

app.get('/books', (req, res) => {
  Books.show_books()
    .then((data) => res.send(data))
    .catch((err) => res.send('No books found'));
})

app.get('/authors', (req, res) => {
  Authors.show_all_authors(res);
})

app.get('/book_dtls', (req, res) => {
  BookDetails.show_book_dtls(res, req.query.id);
})

app.post('/newbook', (req, res) => {
    const familyName = req.body.familyName;
    const firstName = req.body.firstName;
    const genreName = req.body.genreName;
    const bookTitle = req.body.bookTitle;
    if(familyName && firstName && genreName && bookTitle) {
        CreateBook.new_book(res, familyName, firstName, genreName, bookTitle).catch(err => {
                res.send('Failed to create new book ' + err);
              });
    }
    else {
        res.send('Invalid Inputs');
    }

})
