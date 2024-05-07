const pool = require('../../db');
const queries = require('./queries')

// *************** GET ALL RECORD ***************//
const getStudents = (req, res) => {
    pool.query(queries.getStudents, (error, results) => {
        if (error)throw error;
        res.status(200).json(results.rows);
    });
};

const getDepartments = (req, res) => {
    pool.query(queries.getDepartments, (error, results) => {
        if (error)throw error;
        res.status(200).json(results.rows);
    });
};

// *************** GET RECORD TO ID ***************//
const getStudentById =(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query(queries.getStudentById,[id],(error,results) =>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
}

const getDepartmentById =(req,res)=>{
    const id = parseInt(req.params.id);
    pool.query(queries.getDepartmentById,[id],(error,results) =>{
        if(error) throw error;
        res.status(200).json(results.rows);
    })
}

// *************** ADD RECORD ***************//
const addStudent = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const department_id = parseInt(req.body.department_id);
    // check if email exists
    pool.query(queries.checkEmailExists, [email],(error,results) => {
        if(results.rows.length){
            res.send("Email already exists.");
        }
        else{
        pool.query(queries.addStudent, [name, email, department_id], (error, results) =>{
            if (error) throw error;
            res.status(201).send("Student created succesfully!");
        });
        }
    });
}

const addDepartment = (req, res) => {
    const name = req.body.name;

    pool.query(queries.checkNameExists, [name], (error, results) => {
        if (error) {
           // throw error;
        }
        if (results.rows.length > 0) {
            res.status(400).send("Department already exists.");
        } else {
            // add department to db
            pool.query(queries.addDepartment, [name], (error, results) => {
                if (error) {
                    throw error;
                }
                res.status(201).send("Department created successfully!");
            });
        }
    });
}

// *************** REMOVE RECORD ***************//
const removeStudent = (req,res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getStudentById, [id], (error, results) => {
        const noStudentFound =! results.rows.length; 
        if (noStudentFound){
            res.send("Student does not exists in the database");
        }
        pool.query(queries.removeStudent, [id], (error, results)=>{
            if (error) throw error;
            res.status(200).send("Student removed succesfully.");
        });
    });
}

const removeDepartment = (req,res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getDepartmentById, [id], (error, results) => {
        const noDepartmentFound =! results.rows.length; 
        if (noDepartmentFound){
            res.send("Department does not exists in the database");
        }
        pool.query(queries.removeDepartment, [id], (error, results)=>{
            if (error) throw error;
            res.status(200).send("Department removed succesfully.");
        });
    });
}

// *************** UPDATE RECORD ***************//
const updateStudent = (req, res) => {
    const id  = parseInt(req.params.id);
    const { name, email, department_id } = req.body;

    pool.query(queries.getStudentById, [id], (error, results) => {
        const noStudentFound =! results.rows.length; 
        if (noStudentFound){
            res.send("Student does not exists in the database");
        }
        if(name){
            pool.query(queries.updateStudentName, [name, id], (error, results) => {
                if (error) throw error;
                res.status(200).send("Student name updated succesfully")
            })
        }
        if(email){
            pool.query(queries.updateStudentEmail, [email, id], (error, results) => {
                if (error) throw error;
                res.status(200).send("Student email updated succesfully")
            });          
        }
        if(department_id){
            pool.query(queries.updateStudentDepartment, [department_id, id], (error, results) => {
                if (error) throw error;
                res.status(200).send("Student department updated succesfully")
            });          
        }
    })
}

const updateDepartment = (req, res) => {
    const id  = parseInt(req.params.id);
    const { name } = req.body;

    pool.query(queries.getDepartmentById, [id], (error, results) => {
        const noDepartmentFound =! results.rows.length; 
        if (noDepartmentFound){
            res.send("Department does not exists in the database");
        }
        pool.query(queries.updateDepartment, [name, id], (error, results) => {
            if (error) throw error;
            res.status(200).send("Department updated succesfully")
        })
    })
};

module.exports = {
    getStudents,
    getDepartments,

    getStudentById,
    getDepartmentById,

    addStudent,
    addDepartment,

    removeStudent,
    removeDepartment,

    updateStudent,
    updateDepartment,

};
