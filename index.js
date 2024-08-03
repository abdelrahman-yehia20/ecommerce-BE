

import dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve("config/.env")})
import express from 'express'
import { InitApp } from './src/app.js';

const port = process.env.port || 3001;
const app = express();
app.set('case sensitive routing', true);
InitApp(app, express)


app.listen(port, () => {
    console.log(`Example app is listening on port ${port}`);
});




// const port = 3000;

// connectionDB();
// app.use(express.json());
// app.use(appRouter);

// // app.use('/users', userRouter);

// app.use("*", (req, res, next) => {
//     const err = new AppError(`invalid url ${req.originalUrl}`, 404);
//     next(err);
// });

// app.use(globalErrorHandling);

// app.listen(port, () => {
//     console.log(`Example app is listening on port ${port}`);
// });
