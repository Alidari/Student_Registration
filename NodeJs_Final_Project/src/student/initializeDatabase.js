const pool = require('../../db');
const queries = require('./queries')
const nodemailer = require('nodemailer');
const fs = require('fs')

// ************************* CREATE TABLES *************************//
// create Student Table
const createStudentTable = (table_name) => {
    return new Promise((resolve, reject) => { 
        pool.query(queries.check_exists_table, [table_name], (error, results) => {
            if (error) {
                reject(error);
            } else {
                const tableExists = results.rows[0].table_exists;
                if (!tableExists) {
                    pool.query(queries.createStudentTable, (error, results) => {
                        if (error) {
                            reject(error);
                        } else {
                            console.log("Student Table created.");
                            resolve();
                        }
                    });
                } else {
                    console.log("Student Table already exists.");
                    resolve();
                }
            }
        });
    });
};

// create Department Table
const createDepartmentTable = (table_name) => {
    return new Promise((resolve, reject) => {
        pool.query(queries.check_exists_table, [table_name], (error, results) => {
            if (error) {
                reject(error);
            } else {
                const tableExists = results.rows[0].table_exists;
                if (!tableExists) {
                    pool.query(queries.createDepartmentTable, (error, results) => {
                        if (error) {
                            reject(error);
                        } else {
                            console.log("Departments Table created.");
                            resolve();
                        }
                    });
                } else {
                    console.log("Departments Table already exists.");
                    resolve();
                }
            }
        });
    });
};

// Create Student Counter
const createStudentCounterTable = (table_name) => {
    return new Promise((resolve, reject) => {
        pool.query(queries.check_exists_table, [table_name], (error, results) => {
            if (error) {
                reject(error);
            } else {
                const tableExists = results.rows[0].table_exists;
                if (!tableExists) {
                    pool.query(queries.createStudentCounterTable, (error, results) => {
                        if (error) {
                            reject(error);
                        } else {
                            console.log("Student Counter Table created.");
                            pool.query(queries.initializeStudentCounterTable,(error,results)=>{
                                if(error) reject(error);
                                else{
                                    pool.query(queries.countStudents, (error, results) => {
                                        if (error) {
                                            reject(error);
                                        } else {
                                            const studentCount = results.rows[0].student_count;
                                            pool.query(queries.insertInitialStudentCounter, [studentCount], (error, results) => {
                                                if (error) {
                                                    reject(error);
                                                } else {
                                                    console.log("Student Counter Table intialized succesfully.");
                                                    incrementStudentCounterTriggerFunction();
                                                    createIncrementStudentCounterTrigger();
                                                    decrementStudentCounterTriggerFunction();
                                                    createDecrementStudentCounterTrigger();
                                                    resolve();
                                                }
                                            });
                                        }
                                    });
                                }
                            })
                            resolve();
                        }
                    });
                } else {
                    console.log("Student Counter Table already exists.");
                    resolve();
                }
            }
        });
    });
};

// ************************* NUMBER_STD & UPDATED_AT & CREATED_AT COLUMNS  *************************//
// add number_std columns to departments
const addNumberStdColumnToDepartments = async () => {
    return new Promise((resolve, reject) => {
        pool.query(queries.checkExistsColumn, ['departments', 'number_std'], (error, results) => {
            if (error) {
                reject(error);
            } else {
                if (results.rows.length <= 0) {
                    pool.query(queries.addNumberStdColumnToDepartments, (error, results) => {
                        if (error) {
                            reject(error);
                        } else {
                            console.log("number_std column added to departments table.");
                            updateDepartmentStudentCountFunction();
                            createIncrementDepartmentStudentCountTrigger();
                            resolve();
                        }
                    });
                } else {
                    console.log("number_std column already exists in departments table.");
                    resolve();
                }
            }
        });
    });
};

// ADD CREATED-AT COLUMN
// to departments table
const addCreatedAtColumnToDepartments = async () => {
    try {
        // Sütunun var olup olmadığını kontrol et
        const { rows } = await pool.query(queries.checkExistsColumn, ['departments', 'created_at']);

        if (rows.length <= 0) {
            // Sütun yoksa oluştur ve default değeri CURRENT_TIMESTAMP olarak ayarla
            await pool.query(queries.addCreatedAtColumnToDepartments);
            console.log("created_at column added to departments table.");
            await pool.query(queries.createSetCreatedAtFunction);

            // createSetCreatedAtTriggerForStudents tetikleyicisini çalıştır
            await pool.query(queries.createSetCreatedAtTriggerForDepartments);
            console.log("Triggers added");
        } else {
            console.log("created_at column already exists in departments table.");
        }
    } catch (error) {
        console.error("Error adding created_at column to departments table:", error);
    }
};
// // to students table
const addCreatedAtColumnToStudents = async () => {
    try {
        const { rows } = await pool.query(queries.checkExistsColumn, ['students', 'created_at']);
        if (rows.length <= 0) {
            await pool.query(queries.addCreatedAtColumnToStudents);
            console.log("created_at column added to students table.");
            await pool.query(queries.createSetCreatedAtFunction);
            await pool.query(queries.createSetCreatedAtTriggerForStudents);
            console.log("Triggers added");
        } else {
            console.log("created_at column already exists in students table.");
        }
    } catch (error) {
        console.error("Error adding created_at column to students table:", error);
    }
};

// ADD UPDATED-AT COLUMN
// to departments table
const addUpdatedAtColumnToDepartments = async () => {
    try {
        const { rows } = await pool.query(queries.checkExistsColumn, ['departments', 'updated_at']);
        if (rows.length <= 0) {
            await pool.query(queries.addUpdatedAtColumnToDepartments);
            console.log("created_at column added to departments table.");
            await pool.query(queries.createSetUpdatedAtFunctionForDepartments);
            await pool.query(queries.createSetUpdatedAtTriggerForDepartments);
            console.log("Triggers added");
        } else {
            console.log("created_at column already exists in departments table.");
        }
    } catch (error) {
        console.error("Error adding created_at column to departments table:", error);
    }
};
// to students table
const addUpdatedAtColumnToStudents = async () => {
    try {
        const { rows } = await pool.query(queries.checkExistsColumn, ['students', 'updated_at']);
        if (rows.length <= 0) {
            await pool.query(queries.addUpdatedAtColumnToStudents);
            console.log("updated_at column added to students table.");
            await pool.query(queries.createSetUpdatedAtFunctionForStudents);
            await pool.query(queries.createSetUpdatedAtTriggerForStudents);
            console.log("Triggers added");
        } else {
            console.log("updated_at column already exists in students table.");
        }
    } catch (error) {
        console.error("Error adding updated_at column to students table:", error);
    }
};


// *************************  TRIGGERS  *************************//
//TRIGGER FOR DEPARTMENTS TABLE
const updateDepartmentStudentCountFunction = async () => {
    try {
        await pool.query(queries.updateDepartmentStudentCountFunction);
        console.log("update_department_student_count function created or replaced.");
    } catch (error) {
        console.error("Error creating or replacing update_department_student_count function:", error);
    }
};

const createIncrementDepartmentStudentCountTrigger = async () => {
    try {
        await pool.query(queries.createIncrementDepartmentStudentCountTrigger);
        console.log("increment_department_student_count trigger created.");
    } catch (error) {
        console.error("Error creating increment_department_student_count trigger:", error);
    }
};
// TRIGGER FOR STUDENT_COUNTER TABLE
// trigger for decrement number of student on counter_student table 
const incrementStudentCounterTriggerFunction = async () => {
    try {
        await pool.query(queries.incrementStudentCounterTriggerFunction);
        console.log("incrementStudentCounterTriggerFunction created or replaced.");
    } catch (error) {
        console.error("Error creating or replacing incrementStudentCounterTriggerFunction function:", error);
    }
};
const createIncrementStudentCounterTrigger = async () => {
    try {
        await pool.query(queries.createIncrementStudentCounterTrigger);
        console.log("createIncrementStudentCounterTrigger trigger created.");
    } catch (error) {
        console.error("Error creating createIncrementStudentCounterTrigger trigger:", error);
    }
};
// trigger and its function for decrement number of student on counter_student table 
const decrementStudentCounterTriggerFunction = async () => {
    try {
        await pool.query(queries.decrementStudentCounterTriggerFunction);
        console.log("decrementStudentCounterTriggerFunction created or replaced.");
    } catch (error) {
        console.error("Error creating or replacing decrementStudentCounterTriggerFunction function:", error);
    }
};
const createDecrementStudentCounterTrigger = async () => {
    try {
        await pool.query(queries.createDecrementStudentCounterTrigger);
        console.log("createIncrementScreateDecrementStudentCounterTriggertudentCounterTrigger trigger created.");
    } catch (error) {
        console.error("Error creating createDecrementStudentCounterTrigger trigger:", error);
    }
};

// *************** SAVE STUDENTS & MAİL  *************** //

const WEEKLY_BACKUP_PERIOD = process.env.WEEKLY_BACKUP_PERIOD; 

async function writeStudentsToJSON() {
    try {
        const query = 'SELECT * FROM students';
        const { rows } = await pool.query(query);
        const students = JSON.stringify(rows);
        fs.writeFileSync('students_backup.json', students);
        console.log('Student list backed up to students_backup.json');
    } catch (error) {
        console.error('Error writing student list to JSON:', error);
    }
}

// to sent a mail
async function sendEmailWithBackup() {
    try {
        const transporter = nodemailer.createTransport({
            // E-posta ayarları
            service: 'gmail',
            auth: {
                user: '',
                pass: ''
            }
        });
        const mailOptions = {
            from: '',
            to: '',
            subject: 'Weekly Backup',
            text: 'Please find the weekly backup attached.',
            attachments: [
                { filename: 'students_backup.json', path: 'students_backup.json' }
            ]
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Backup email sent:', info.response);
    } catch (error) {
        console.error('Error sending backup email:', error);
    }
}

function weeklyBackupTrigger() {
    const weeklyPeriodSeconds = WEEKLY_BACKUP_PERIOD * 604800; // 604800 saniye = 1 hafta

    setInterval(() => {
        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay();

        if (dayOfWeek === 0 && currentDate.getHours() === 0) {
            writeStudentsToJSON(); 
            sendEmailWithBackup();
        }
    }, weeklyPeriodSeconds * 1000); 
}

async function initializeDatabase() {
    const student_table_name = 'students';
    const departmant_table_name = 'departments';
    const student_counter_table_name = 'student_counter';
    try {
        await createDepartmentTable(departmant_table_name);
        await createStudentTable(student_table_name);
        await createStudentCounterTable(student_counter_table_name);


        await addNumberStdColumnToDepartments();
        await addCreatedAtColumnToDepartments();
        await addCreatedAtColumnToStudents();

        await addUpdatedAtColumnToDepartments();
        await addUpdatedAtColumnToStudents();

        console.log("Database initialized successfully.");
        //weeklyBackupTrigger();

    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

module.exports = {
    initializeDatabase: initializeDatabase
}

