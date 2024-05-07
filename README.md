# Student_Registration

**KURULUM**
- 
- Veri tabanı bağlama
Veri tabanını bağlamak için bir ".env" dosyası oluşturun ve içerisine veri tabanı bilgilerinizi giriniz
Örnek .env dosya içeriği
`DB_HOST="localhost"`
`DB_USER="postgres"`
`DB_PORT=5432`
`DB_PASSWORD="DATABASE_SİFRENİZ"`
`DB_DATABASE="DATABASE_ISMI"`

içinde yer alan

	`DB_PASSWORD="DATABASE_SİFRENİZ"`
	`DB_DATABASE="DATABASE_ISMI" `

kısma kendi veri tabanı bilgilerinizi girebilirsiniz.

- Ardından terminalde `node ./index.js` komutunu yazarak dosyanızı çalıştırabilirsiniz.
- Tarayıcınız üzerinden `localhost:3000/students` yazarsanız kendi local hostunuza bağlanıp veri tabanındaki mevcut öğrencileri görüntüleyebilirsiniz. 
- Öğrenci veya Bölüm Ekleme Silme ve Güncelleme işlemleri
Bu işlemleri gerçekleştirebilmek için post, put veya delete isteklerini kullanmanız gerekiyor
Bu istekleri atabileceğiniz birçok araç mevcuttur verilecek örnekte ise Visual Studio Code eklentisi olan Thunder Client kullanılacaktır

![image](https://github.com/Alidari/Student_Registration/assets/92364056/1d5f5bc8-09b4-4823-86e3-a2bef26dd23e)

bu kısımdan bağlantı adresimizi ve göndereceğimiz istek türünü seçiyoruz. (Ekleme yapmak için; Post, Güncelleme yapmak için; Put, Silme işlemi için; Delete)

![image](https://github.com/Alidari/Student_Registration/assets/92364056/96709152-9fa5-4beb-90fc-ca6356b8bfc0)

ardından bu şekilde json formatında bilgileri gönderip veri tabanında güncellemelerde bulunabilirsiniz. 

# Documentation

 #### Project Structure
   
The project follows a modular structure for better organization and maintainability. Below is an overview of the main directories and their contents:

[server.js](./server.js): Entry point of the application where the server is initialized and middleware are configured.

[db.js](./db.js): Directory containing database-related files.

[queries.js](./src/student/queries.js): Contains SQL queries used to interact with the database.

[initializeDatabase.js](./src/student/initializeDatabase.js): Script to initialize the database and its schemas.

[controller.js](./src/student/controller.js): Directory containing controller files for handling business logic.

[routes.js](./src/student/routes.js): Directory containing route files for defining API endpoints.



## [initializeDatabase.js](./src/student/initializeDatabase.js)
These codes are independent modules that perform database creation and configuration operations. 
Each function performs a specific task, and appropriate messages are logged to the console when the operations are successfully executed. 
This module enables easy configuration and management of database operations.

### Database Creation and Table Creation:

* Functions like createStudentTable, createDepartmentTable, and createStudentCounterTable are responsible for creating tables for students, departments, and student counters, respectively.
* Each table checks if it already exists by first verifying if a table exists with the given name using a query from the queries module.
* If the table does not exist, it is created using SQL queries from the queries module.
* After creating the table, relevant messages are logged to the console indicating the success of the operation.

### Column Additions:
* Functions such as addNumberStdColumnToDepartments, addCreatedAtColumnToDepartments, addCreatedAtColumnToStudents, addUpdatedAtColumnToDepartments, and addUpdatedAtColumnToStudents are responsible for adding extra columns to the tables.
* For example, the departments table is augmented with columns such as number_std, created_at, and updated_at.
* Columns are not re-added if they already exist, and relevant messages are logged to the console.
* Additionally, triggers and functions are created after each column addition.

### Creation of Triggers and Functions:
* Functions like updateDepartmentStudentCountFunction, createIncrementDepartmentStudentCountTrigger, incrementStudentCounterTriggerFunction, createIncrementStudentCounterTrigger, decrementStudentCounterTriggerFunction, and createDecrementStudentCounterTrigger are responsible for creating.
* PostgreSQL triggers and functions.
* These triggers and functions handle updating data in database tables and taking actions regarding changes.

### Weekly Backup Function:
* The weeklyBackupTrigger function performs weekly backup operations.
* When a certain period (weekly interval) has passed, the weekly backup operations are triggered.
* Weekly backup operations consist of writing the student list to a JSON file using the writeStudentsToJSON function and sending this file as an email attachment using the sendEmailWithBackup function.

### Database Initialization Function:
* The initializeDatabase function initiates all database operations.
* These operations include table creation, column additions, trigger creation, and starting the weekly backup trigger.
* When all operations are successfully completed, a success message is logged to the console.


## [controller.js](./src/student/controller.js)

This module contains functions to interact with the database, perform CRUD operations, and handle database-related errors.

### Functions:
##### Get All Records:
* getStudents: Retrieves all student records from the database.
* getDepartments: Retrieves all department records from the database.
##### Get Record by ID:
* getStudentById: Retrieves a specific student record by ID.
* getDepartmentById: Retrieves a specific department record by ID.
##### Add Record:
* addStudent: Adds a new student record to the database.
* addDepartment: Adds a new department record to the database.
##### Remove Record:
* removeStudent: Removes a student record from the database by ID.
* removeDepartment: Removes a department record from the database by ID.
##### Update Record:
* updateStudent: Updates an existing student record in the database.
* updateDepartment: Updates an existing department record in the database.
##### Error Handling:
* Error handling is implemented for each database operation to catch and handle any potential errors that may occur during execution.
* If an error occurs during database operations, appropriate error messages are returned to the client.





