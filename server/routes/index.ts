// src/routes/index.ts
import { Router } from 'express';
import userRouter from './user.routes';
import employeeRouter from './employee.routes';
import authRouter from './auth.routes'
import documentRouter from './document.routes'


const rootRouter = Router();

// Categorize by prefixing with /users
rootRouter.use('/users', userRouter);
rootRouter.use('/employees', employeeRouter);  //Router for employees
rootRouter.use('/login', authRouter);   //Router for Login
rootRouter.use('/documents', documentRouter); //Document

// Catch-all for 404s within the API
rootRouter.use((req, res) => {
  res.status(404).json({ error: "API Route not found" });
});

export default rootRouter;