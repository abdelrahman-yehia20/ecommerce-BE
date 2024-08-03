// app.js or server.js
import connectionDB from '../DB/connectionDB.js';
import { AppError } from '../utils/classError.js';
import { globalErrorHandling } from '../utils/globalErrorhandling.js';
import { appRouter } from '../src/modules/index.routes.js';
import { deleteFromCloudinary } from '../utils/deleteFromCloudinary.js';
import { deleteFromDB } from '../utils/deleteFromDB.js';
import cors from 'cors'

export const InitApp = (app, express) => {
    app.use(cors())

    connectionDB();

    app.use(express.json());
    app.get("/",(req, res)=>{
        res.status(200).json({msg: "hello on my project"})
    })
    app.use(appRouter);

    app.use("*", (req, res, next) => {
        const err = new AppError(`invalid url ${req.originalUrl}`, 404);
        next(err);
    });

    app.use(globalErrorHandling, deleteFromCloudinary, deleteFromDB);

    
}
