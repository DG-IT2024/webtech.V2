import {Router} from 'express';
import { getAllEmployees, addEmployee, updateEmployee, deleteEmployee } from '../controllers/employee.controller';

const router = Router();
router.get('/allEmployees', getAllEmployees);
router.post('/addEmployee', addEmployee);
router.put('/updateEmployee/:userID', updateEmployee);
router.delete('/deleteEmployee/:userID', deleteEmployee);

export default router;