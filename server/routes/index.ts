// src/routes/index.ts
import { Router } from 'express';
import employeeRouter from './user.routes';
import authRouter from './auth.routes'
import documentRouter from './document.routes'
import emailRouter from './email.routes'


const rootRouter = Router();

// Categorize by prefixing with /users
rootRouter.use('/employees', employeeRouter);  //Router for employees
rootRouter.use('/login', authRouter);   //Router for Login
rootRouter.use('/documents', documentRouter); //Document
rootRouter.use('/emailNotification', emailRouter) //Sending emails

// Catch-all for 404s within the API
rootRouter.use((req, res) => {
  res.status(404).json({ error: "API Route not found" });
});

export default rootRouter;