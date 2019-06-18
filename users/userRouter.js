const express = require('express');

const userDb = require('./userDb.js')
const postDb = require('../posts/postDb.js')

const router = express.Router();

router.use(express.json())

router.post('/', validateUser, (req, res) => {

  userDb.insert(req.user)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })

});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {

  postDb.insert(req.post)
  .then(post => {
    res.status(201).json(post)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })

});

router.get('/', (req, res) => {
  userDb.get()
  then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  userDb.getById(req.userId)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  postDb.getById(req.userId)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })
});

router.delete('/:id', validateUserId,  (req, res) => {
  userDb.remove(req.userId)
  .then(user => {
    res.status(200).json({success: "User successfully deleted"})
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  userDb.update(req.userId, req.user)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(err => {
    res.status(500).json({error: "Bad Request"})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params

    userDb.getById(id)
    .then(user => {
      if(user) {
        req.userId = user.id
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
      req.user = {
        name: req.body.name
      }
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
      req.post = {
        text: req.body.text,
        user_id: req.params.id
      }
      next()
    } else {
      res.status(400).json({ message: "missing required text field" })
    }
  } else {
    res.status(400).json({ message: "missing post data" })
  }
};

module.exports = router;
