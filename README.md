# Content Management System

### Acceptance Criteria
    1. Have a command line app that uses user input ✅
    2. Have the following options on startup:
        a. view all departments ✅
        b. view all roles ✅
        c. view all employees ✅
        d. add a department ✅
        e. add a role ✅
        f. add an employee ✅
        g. update an employee role ✅
    3. Viewing all departments should present all department names and their IDs ✅
    4. Viewing all roles should present with job title, role id, department it belongs to, and salary ✅
    5. Viewing all employees should have a table with employee ids, first names, last names, job titles, departments, salaries, and managers that employees report to ✅
    6. Adding a department should allow user to enter a new department ✅
    7. Adding a role should allow user to enter a new role with name, salary, and department ✅
    8. Adding an employee should allow user to enter a new employee ✅
    9. Updating allows user to select an employee and update their new role ✅

### Application specifics
    1. Should use MySQL and SQL files for database modification and storage ✅
    2. Should use Inquirer for user input ✅
    3. Should use Console.Table for logging use ✅
    4. MySQL Table Breakdowns:
        A. Department ✅
            i. id: INT PRIMARY KEY ✅
            ii. name: VARCHAR(30) ✅
        B. Role ✅
            i. id: INT PRIMARY KEY ✅
            ii. title: VARCHAR(30) ✅
            iii. salary: DECIMAL ✅
            iv. department_id: INT to reference department(id) ✅
        C. Employee ✅
            i. id: INT PRIMARY KEY ✅
            ii. first_name: VARCHAR(30) ✅
            iii. last_name: VARCHAR(30) ✅
            iv. role_id: INT to hold reference to role(id) ✅
            v. manager_id INT to hold reference to employee(id), can be null ✅
    5. Application SQL files should include a schema and a seeds to populate the database ✅

### Bonus: 
    1. Be able to update employee managers ✅
    2. View employees by manager ✅
    3. view employees by department ✅
    4. Delete departments, roles, and employees ✅
    5. View the combined salaries of all employees in a department ✅

### Application Description
CMS, or content management system, is a database system designed to allow users to quickly and efficiently create and manage a variety of tools for a department. 
On database creation, the user is given various generic departments, roles, and employees. 
When launching the application via node.js on the index.js file, the user is given selection options with inquirer npm on the main menu. 
Selecting an option will call upon varying functions, which will ask for information and then pushing it into the database. 
These options include viewing all departments, viewing all roles, viewing all employees, 
adding departments, adding roles, adding employees, 
updating employees' roles, updating employees' managers, 
viewing employees by manager, viewing employees by department, viewing the combined salaries of employees of a department, 
and the ability to delete departments, roles, and employees from the database. 
All of these database requests are handled in the JS file and then either modify or retrieve data from the database accordingly. 

### To use
    Please run the schema.sql followed by the seeds.sql prior to starting the application. 
    This can be done in the /db folder with MySQL commands. 


Github repo: https://github.com/shawnbandy/CMS

Link to video: https://www.youtube.com/watch?v=MbHEhctDvc4
