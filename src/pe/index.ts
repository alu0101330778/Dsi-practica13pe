import express from 'express';
import './db/mongoose.js';
import { userRouter } from './server/server.js';

const app = express();
app.use(express.json());
app.use(userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});