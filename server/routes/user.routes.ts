import {Router} from 'express';
import { getAllEmployees, addEmployee, updateEmployee, deleteEmployee, generateUserID } from '../controllers/user.controller';

const router = Router(); // Create an Express router instance
router.get('/allEmployees', getAllEmployees); // Route to retrieve all employees
router.post('/addEmployee', addEmployee); // Route to create a new employee
router.put('/updateEmployee/:userID', updateEmployee); // Route to update an employee using userID
router.delete('/deleteEmployee/:userID', deleteEmployee); // Route to delete an employee using userID
router.get('/newEmployee', generateUserID); //To generate new user ID

export default router;