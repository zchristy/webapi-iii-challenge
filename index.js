const express = require('express');

const server = require('./server.js');
const userRoutes = require('./users/userRouter.js')
const postRoutes = require('./posts/postRouter.js')

const app = express();

app.use('/', server)
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)

app.listen(5000, () => {
  console.log('App is running on port 5000')
})
