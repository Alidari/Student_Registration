const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/student', controller.getStudents);
router.get('/department', controller.getDepartments);

router.post("/student",controller.addStudent);
router.post("/department",controller.addDepartment);

router.get("/student/:id",controller.getStudentById);
router.get("/department/:id",controller.getDepartmentById);

router.put("/student/:id", controller.updateStudent);
router.put("/department/:id", controller.updateDepartment);

router.delete("/student/:id",controller.removeStudent);
router.delete("/department/:id",controller.removeDepartment);

module.exports = router;