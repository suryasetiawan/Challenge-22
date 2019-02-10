var express = require('express');
var router = express.Router();
const helpers = require('../helpers/util')
var mongodb = require('mongodb');

module.exports = function(db){

  const User = db.collection('data');

  // router.get('/', (req, res) => {
  //   User.find().toArray((err,docs)=> {
  //     if (err) throw err;
  //     res.render('index', {data: docs});
  //   });
  // });

  router.get("/", (req, res) => {
    let params = {};
    if (req.query.checkstring && req.query.string) {
      params["string"] = req.query.string
    }
    if (req.query.checkinteger && req.query.integer) {
      params["integer"] = req.query.integer
    }
    if (req.query.checkfloat && req.query.float) {
      params["float"] = req.query.float
    }
    if (req.query.checkdate && req.query.startdate && req.query.enddate) {
      params["date"] = {
        $gte: req.query.startdate,
        $lt: req.query.enddate
      }
    }
    if (req.query.checkboolean && req.query.boolean) {
      params["boolean"] = req.query.boolean
    }

    User.find(params).count((err, count) => {
      let page = req.query.page || 1;
      let limitpage = 5;
      let offset = (page - 1) * limitpage;
      let url = req.url == "/" ? "/?page=1" : req.url;
      let total = count;
      let pages = Math.ceil(total / limitpage);
      User.find(params, {
        limit: limitpage,
        skip: offset
      }).toArray((err, docs) => {
        res.render("index", {
          data: docs,
          page,
          pages,
          query: req.query,
          url
        });
      });
    });
  })

  // router.get('/', function (req, res) {
  //   let params = {};
  //
  //   if (req.query.checkid && req.query._id) {
  //     params["_id"] = req.query._id;
  //   }
  //   if (req.query.checkstring && req.query.string) {
  //     params["string"] = req.query.string;
  //   }
  //   if (req.query.checkinteger && req.query.integer) {
  //     params["integer"] = req.query.integer;
  //   }
  //   if (req.query.checkfloat && req.query.float) {
  //     params["float"] = req.query.float;
  //   }
  //   if (req.query.checkdate && req.query.startdate && req.query.enddate) {
  //     params["date"] = {
  //       "$gte": new Date(req.query.startdate),
  //       "$lt": new Date(req.query.enddate)
  //     }
  //   }
  //   if (req.query.checkboolean && req.query.boolean) {
  //     params["boolean"] = boolean = req.query.boolean
  //   }
  //   User.find(params, (err, count) => {
  //     const page = req.query.page || 1;
  //     const limit = 5;
  //     const offset = (page - 1) * limit;
  //     const url = req.url == '/' ? '/?page=1' : req.url
  //     const total = count.length;
  //     const pages = Math.ceil(total / limit);
  //
  //     User.find(params, null, {
  //       limit: limit,
  //       skip: offset
  //     }).then((data) => {
  //       res.render('index', {
  //         data,
  //         page,
  //         pages,
  //         query: req.query,
  //         url,
  //         moment
  //       });
  //     });
  //   });
  // });

  router.get('/add', (req, res) => {
    res.render('add');
  });

  router.get('/edit/:id', function (req, res) {
    User.find({
      _id:new mongodb.ObjectId(req.params.id)
    }).toArray((err,data)=> {
      if (err) throw err;
      res.render('edit', {
        item:data[0]
      });
    });
  });

  router.post('/add', function (req, res) {
    User.insertOne({
      _id: req.body._id,
      string: req.body.string,
      integer: req.body.integer,
      float: req.body.float,
      date:req.body.date,
      boolean: req.body.boolean},
      (err,result)=>{
        res.redirect('/');
      })
    })

    router.post('/edit/:id', function(req,res){
      let id = new mongodb.ObjectId(req.params.id);
      User.update({_id : id }, {
        $set:{
          string: req.body.string,
          integer: req.body.integer,
          float: req.body.float,
          date: req.body.date,
          boolean: req.body.boolean
        }
      }, (err,result) => {
        res.redirect('/');

      })

    })

    router.get('/delete/:id', function(req,res){
      User.deleteOne({
        _id:new mongodb.ObjectId(req.params.id)
      },(err) => {
        if (err) throw err;
        res.redirect('/');
      })
    })

    return router;
  }
  // /* GET home page. */
  // router.get('/', helpers.isLoggedIn, function(req, res, next) {
  //   // Find some documents
  //   Todo.find({}).toArray(function(err, docs) {
  //     //res.send(docs);
  //     res.render('index', { title: 'Express', docs, user: req.session.user });
  //   });
  // });
  //
  // router.get('/login', (req, res)=>{
  //   res.render('login', {loginMessage: req.flash('loginMessage')});
  // });
  //
  // router.post('/login', (req, res)=>{
  //   User.find({email: req.body.email, password: req.body.password}).toArray((err, data)=>{
  //     console.log(data);
  //     if(err){
  //       res.send(err);
  //     }
  //     if(data.length > 0){
  //       req.session.user =data[0]
  //       res.redirect('/')
  //     }else{
  //       req.flash('loginMessage', 'Username fgreger or password invalid')
  //       res.redirect('/login')
  //     }
  //   })
  // })
  //
  // router.get('/logout', (req, res)=>{
  //   req.session.destroy(()=>{
  //     res.redirect('/')
  //   })
  // })
