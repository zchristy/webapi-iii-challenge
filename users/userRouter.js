const express = require('express');

const userDb = require('./userDb.js')
const postDb = require('../posts/postDb.js')

const router = express.Router();

router.use(express.json())

router.post('/', validateUser, (req, res) => {
  const newUser = {
    name: req.body.name
  }

  userDb.insert(newUser)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })

});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const { id } = req.user
  const newPost = {
    text: req.body.text,
    user_id: id
  }

  postDb.insert(newPost)
  .then(post => {
    res.status(201).json(post)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })

});

router.get('/', (req, res) => {

});

router.get('/:id', validateUserId, (req, res) => {

});

router.get('/:id/posts', validateUserId, (req, res) => {

});

router.delete('/:id', validateUserId,  (req, res) => {

});

router.put('/:id', validateUserId, (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params

    userDb.getById(id)
    .then(user => {
      if(user) {
        req.user = user
        next()
      } else {
        res.status(400).json({ message: "invalid user id" })
      }
    })
    .catch(err => {
      res.status(500).json({error: "bad request"})
    })

};

function validateUser(req, res, next) {

  if(Object.keys(req.body).length) {
    if(req.body.name) {
      next()
    } else {
      res.status(400).json({ message: "missing required text field" })
    }
  } else {
    res.status(400).json({ message: "missing post data" })
  }

};

function validatePost(req, res, next) {

  if(Object.keys(req.body).length) {
    if(req.body.text) {
      next()
    } else {
      res.status(400).json({ message: "missing required text field" })
    }
  } else {
    res.status(400).json({ message: "missing post data" })
  }
};

module.exports = router;
