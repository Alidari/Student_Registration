// *************** CHECK EXİSTS QUERİES *************** //

const check_exists_table = `
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = $1
) AS table_exists
`;

const checkEmailExists = "SELECT s FROM students s WHERE s.email = $1";

const checkNameExists = "SELECT s FROM departments s WHERE s.name = $1";

const checkExistsColumn = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = $1 AND column_name = $2;
        `;

// *************** CREATE TABLE QUERİES *************** //
const createStudentTable = `
    CREATE TABLE students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        department_id INT,
        FOREIGN KEY (department_id) REFERENCES departments(id)
    )
`;

const createDepartmentTable = `
    CREATE TABLE departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255)
    )
`;

const createStudentCounterTable = `
CREATE TABLE IF NOT EXISTS student_counter (
    counter INT DEFAULT 0
);
`;

// *************** QUERİES FOR CONTROLLER *************** //
const getStudents = "SELECT * FROM students";
const getDepartments ="SELECT * FROM departments";

const getStudentById = "SELECT * FROM students WHERE id=$1";
const getDepartmentById = "SELECT * FROM departments WHERE id=$1";

const addStudent = "INSERT INTO students (name, email, department_id ) VALUES ($1, $2, $3 )";
const addDepartment = "INSERT INTO departments (name) VALUES ($1)";

const removeStudent = "DELETE FROM students WHERE id=$1";
const removeDepartment = "DELETE FROM departments WHERE id=$1";

const updateStudentName = "UPDATE students SET name = $1 WHERE id = $2";
const updateStudentEmail = "UPDATE students SET email = $1 WHERE id = $2";
const updateStudentDepartment = "UPDATE students SET department_id = $1 WHERE id = $2";

const updateDepartment = "UPDATE departments SET name = $1 WHERE id = $2";

// *************** QUERİES TO ADD NEW COLUMN *************** //
const addNumberStdColumnToDepartments = `
ALTER TABLE departments
ADD COLUMN number_std INT DEFAULT 0;
`;

const addCreatedAtColumnToDepartments = `
    ALTER TABLE departments
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
`;

const addCreatedAtColumnToStudents = `
    ALTER TABLE students
    ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
`;

const addUpdatedAtColumnToDepartments = `
    ALTER TABLE departments
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
`;

const addUpdatedAtColumnToStudents = `
    ALTER TABLE students
    ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
`;

// *************** QUERİES TO INITIALİZE STUDENT COUNTER TABLE *************** //
const initializeStudentCounterTable= "INSERT INTO student_counter (counter) VALUES (0)";

const countStudents = `
SELECT COUNT(*) AS student_count
FROM students;
`;

const insertInitialStudentCounter = `
INSERT INTO student_counter (counter)
VALUES ($1);
`;

// *************** TRIGGERS FOR QUERİES AND ITS FUNCTİONS *************** //
const createSetCreatedAtFunction = `
CREATE OR REPLACE FUNCTION set_created_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

const createSetCreatedAtTriggerForStudents = `
CREATE TRIGGER set_created_at_students_trigger
BEFORE INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION set_created_at();
`;

const createSetCreatedAtTriggerForDepartments = `
CREATE TRIGGER set_created_at_departments_trigger
BEFORE INSERT ON departments
FOR EACH ROW
EXECUTE FUNCTION set_created_at();
`;

// trigger for number_str
const updateDepartmentStudentCountFunction = `
CREATE OR REPLACE FUNCTION update_department_student_count()
RETURNS TRIGGER AS
$$
BEGIN
    UPDATE departments
    SET number_std = number_std + 1
    WHERE id = NEW.department_id;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
`;

const createIncrementDepartmentStudentCountTrigger = `
CREATE TRIGGER increment_department_student_count
AFTER INSERT ON students
FOR EACH ROW
WHEN (NEW.department_id IS NOT NULL)
EXECUTE FUNCTION update_department_student_count();
`;

const incrementStudentCounterTriggerFunction = `
CREATE OR REPLACE FUNCTION increment_student_counter_trigger()
RETURNS TRIGGER AS
$$
BEGIN
    UPDATE student_counter
    SET counter = counter + 1;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
`;

const createIncrementStudentCounterTrigger = `
CREATE TRIGGER increment_student_counter
AFTER INSERT ON students
FOR EACH ROW
EXECUTE FUNCTION increment_student_counter_trigger();
`;

const decrementStudentCounterTriggerFunction = `
CREATE OR REPLACE FUNCTION decrement_student_counter_trigger()
RETURNS TRIGGER AS
$$
BEGIN
    UPDATE student_counter
    SET counter = counter - 1;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;
`;

const createDecrementStudentCounterTrigger = `
CREATE TRIGGER decrement_student_counter
AFTER DELETE ON students
FOR EACH ROW
EXECUTE FUNCTION decrement_student_counter_trigger();
`;

const createSetUpdatedAtFunctionForStudents = `
CREATE OR REPLACE FUNCTION set_updated_at_students()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

const createSetUpdatedAtTriggerForStudents = `
CREATE TRIGGER set_updated_at_students_trigger
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_students();
`;

const createSetUpdatedAtFunctionForDepartments = `
CREATE OR REPLACE FUNCTION set_updated_at_departments()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

const createSetUpdatedAtTriggerForDepartments = `
CREATE TRIGGER set_updated_at_departments_trigger
BEFORE UPDATE ON departments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_departments();
`;

module.exports = {
    getStudents,
    getDepartments,

    getStudentById,
    getDepartmentById,

    checkEmailExists,
    checkNameExists,

    addStudent,
    addDepartment,

    removeStudent,
    removeDepartment,

    updateStudentName,
    updateStudentEmail,
    updateStudentDepartment,

    updateDepartment,
    
    check_exists_table,

    createStudentTable,
    createDepartmentTable,

    addNumberStdColumnToDepartments,
    updateDepartmentStudentCountFunction,
    createIncrementDepartmentStudentCountTrigger,

    checkExistsColumn,

    createStudentCounterTable,

    initializeStudentCounterTable,

    incrementStudentCounterTriggerFunction,
    createIncrementStudentCounterTrigger,
    decrementStudentCounterTriggerFunction,
    createDecrementStudentCounterTrigger,

    countStudents,
    insertInitialStudentCounter,

    addCreatedAtColumnToDepartments,
    addCreatedAtColumnToStudents,

    createSetCreatedAtFunction,
    createSetCreatedAtTriggerForStudents,
    createSetCreatedAtTriggerForDepartments,

    addUpdatedAtColumnToStudents,
    addUpdatedAtColumnToDepartments,
    createSetUpdatedAtFunctionForStudents,
    createSetUpdatedAtTriggerForStudents,
    createSetUpdatedAtFunctionForDepartments,
    createSetUpdatedAtTriggerForDepartments

};