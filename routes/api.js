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
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  MongoClient.connect(process.env.DB, (err, db) => {
    
    if (err) 
      console.log('Error Connecting to Database')
    else {
      
      console.log('Successfully Connected to a Database')
      
      app.route('/api/books')
        .get(function (req, res){
          //response will be array of book objects
          //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
        })

        .post(function (req, res){
          var title = req.body.title;
          //response will contain new book object including atleast _id and title
          db.collection('books').insertOne({title: title}, (err, doc) => {
            if (err) {
              console.log(err)
              res.json({'error': 'Error in Adding Book'})
            } else {
              res.json({doc})
            }
          })
        })

        .delete(function(req, res){
          //if successful response will be 'complete delete successful'
        });



      app.route('/api/books/:id')
        .get(function (req, res){
          var bookid = req.params.id;
          //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        })

        .post(function(req, res){
          var bookid = req.params.id;
          var comment = req.body.comment;
          //json res format same as .get
        })

        .delete(function(req, res){
          var bookid = req.params.id;
          //if successful response will be 'delete successful'
        });
      
    }
    
  })
  
};
