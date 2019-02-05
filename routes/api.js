/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
let db
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  MongoClient.connect(MONGODB_CONNECTION_STRING, (err, dba) => {
    
    if (err) 
      console.log('Error Connecting to Database')
    else {
      console.log('Successfully Connected to a Database')
      db = dba            
    }
    
  })
  
  app.route('/api/books')
        .get(function (req, res){
          //response will be array of book objects
          //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
          let books = db.collection('books').find({}, ['_id', 'title', 'commentcount'])
          books.toArray((err, book) => {
            if (err) {
              console.log(err)
              res.json({error: 'Error'})
            } else {
              res.json(book)
            }
          })
          
    
        })

        .post(function (req, res){
          var title = req.body.title;
          //response will contain new book object including atleast _id and title
          if (title == '') {
            res.json({error: 'Empty Title'})
            return
          }
          db.collection('books').insert({title: title, comments: [], commentcount: 0}, (err, doc) => {
            if (err) {
              console.log(err)
              res.json({'error': 'Error in Adding Book'})
            } else {
              res.json({_id: doc.ops[0]._id, title: doc.ops[0].title})
            }
          })
        })

        .delete(function(req, res){
          //if successful response will be 'complete delete successful'
          db.collection('books').deleteMany({}, (err, doc) => {
            if (err) {
              console.log(err)
              res.send('Error Deleting Book')
            } else {
              res.send('complete delete successful')
            }
          })
        });



      app.route('/api/books/:id')
        .get(function (req, res){
          var bookid = req.params.id;
          //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
          let books = db.collection('books').find({_id: ObjectId(bookid)}, ['_id', 'title', 'comments'])
          books.toArray((err, book) => {
            if (err) {
              console.log(err)
              res.json({error: 'Error'})
            } else {
              if (book.length == 0 ) {
                res.send('no book exists')
              } else {
                res.json(book[0])
              }
            }
          })
        })

        .post(function(req, res){
          var bookid = req.params.id;
          var comment = req.body.comment;
          //json res format same as .get
          db.collection('books').findOneAndUpdate(
            {_id: ObjectId(bookid)},
            {$push: { comments: comment }, $inc: { commentcount: +1 }},
            (err, doc) => {
              if (err) {
                console.log(err)
                res.json({error: 'Error Adding Comment'})
              } else {
                res.redirect('/api/books/'+bookid)
              }
            }
          )
        })

        .delete(function(req, res){
          var bookid = req.params.id;
          //if successful response will be 'delete successful'
          db.collection('books').deleteOne({_id: ObjectId(bookid)}, (err, doc) => {
            if (err) {
              console.log(err)
              res.send('Error Deleting Book')
            } else {
              res.send('delete successful')
            }
          })
        });
  
};
