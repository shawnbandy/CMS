const inquirer = require('inquirer')
const cTable = require('console.table');
const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3005;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let role

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'p1Shooter~',
        database: 'store_db'
    },
    console.log(`Connected to the store database.`)
);


//*main menu selection to bounce between separate options
welcomeMessage = () => {
    return inquirer.prompt([
        {
            type: 'confirm',
            message: "Welcome! Would you like to access the database?",
            name: "confirm"
        }
    ])
        .then((answer) => {
            if (answer.confirm == true) {
                mainMenu();
            }
            else {
                return;
            }
        })
}


mainMenu = () => {
    let choiceSelection;
    return inquirer.prompt([
        {
            type: 'list',
            message: 'Please select one of the following options below:',
            choices: ['View all roles',
                'View all departments',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'View Employees by Manager',
                'View Employees by Department',
                'View Department Salary',
                'Delete',
                'Update Manager',
                'Quit'],
            name: 'selection'
        }
    ])
        .then((answer) => {
            const { selection } = answer
            switch (selection) {
                case 'View all roles':
                    choiceSelection = viewRoles();
                    break;

                case 'View all departments':
                    choiceSelection = viewDepartments();
                    break;

                case 'View all employees':
                    choiceSelection = viewEmployees();
                    break;

                case 'Add a department':
                    choiceSelection = addDepartment();
                    break;

                case 'Add a role':
                    choiceSelection = addRole();
                    break;

                case 'Add an employee':
                    choiceSelection = addEmployee();
                    break;

                case 'Update an employee role':
                    choiceSelection = updateEmployee();
                    break;

                case 'View Employees by Manager':
                    choiceSelection = employeeByManager();
                    break;

                case 'View Employees by Department':
                    choiceSelection = employeeByDepartment();
                    break;

                case 'View Department Salary':
                    choiceSelection = salaryByDepartment();
                    break;

                case 'Delete':
                    choiceSelection = deleteSomething();
                    break;

                case 'Update Manager':
                    choiceSelection = updateManager();
                    break;

                case 'Quit':
                    choiceSelection = "Goodbye";
                    break;

            }
            return (choiceSelection == "Goodbye" ? console.log(choiceSelection) : choiceSelection);
        })
}

viewRoles = () => {
    db.query(`SELECT roles.id AS Role_ID, roles.title AS Role_Title, roles.salary AS Salary, roles.department_id AS Department_ID, 
    department.nameOfDepartment AS Department 
    FROM roles 
    JOIN department ON roles.department_id = department.id`, function (err, results) {
        if (err) throw err;
        console.table(results);
        mainMenu()
    })
}

viewDepartments = () => {
    db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
        mainMenu();
    })
}

viewEmployees = () => {
    db.query(`SELECT employee.id AS ID_Tag, employee.first_name AS First, employee.last_name AS Last, manager_id As Managers_ID, employee.role_id AS Role_ID, 
    roles.title AS Title, roles.salary AS Salary, 
    department.nameOfDepartment AS Department 
    FROM employee 
    JOIN roles on employee.role_id = roles.id 
    JOIN department on roles.department_id = department.id`, function (err, results) {
        if (err) throw err;
        console.table(results);
        mainMenu();
    })
}


//*FOR this Im thinking to use the db.stuff found in assignment 21 line 27
//*basically get all of the inputs in an inquirer, then use the .then() to deconstruct the object and add to the db
//*may want to make like a class JS for adding stuff and viewing stuff to clean this up a little
addDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            message: 'What is the department name?',
            name: 'departmentName',
            validate: input => { return !input ? "Please answer the question" : true }
        }
    ])
        .then((answers) => {
            const { departmentName } = answers;
            db.query(
                `INSERT INTO department (nameOfDepartment) VALUES ("${departmentName}")`, function (err, results) {
                    console.table("Added!");
                    mainMenu()
                })
        })
}

addRole = () => {

    let department = [];

    db.query('SELECT * from department', function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let departmentData = {
                name: results[i].nameOfDepartment,
                value: {
                    id: results[i].id
                }
            }
            department.push(departmentData);
        }
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the role title?',
                name: 'roleTitle',
                validate: input => { return !input ? "Please answer the question" : true }
            },
            {
                type: 'input',
                message: 'What is the role salary?',
                name: 'roleSalary',
                validate: input => { return isNaN(input) ? "Please enter a number" : true; }
            },
            {
                type: 'list',
                message: 'What is their role department?',
                choices: department,
                name: 'roleDepartment',

            }
        ])
            .then((answers) => {
                const { roleTitle, roleSalary, roleDepartment } = answers;

                db.query(
                    `INSERT INTO roles (title, salary, department_id) VALUES ("${roleTitle}", ${roleSalary}, ${roleDepartment.id})`, function (err, results) {
                        if (err) throw err;
                        mainMenu();
                    })
            })
    })

}

addEmployee = () => {

    let roleChoices = [];
    let managerChoices = [{
        name: "none",
        value: {
            id: null
        }
    }];

    db.query('SELECT * FROM employee WHERE role_id = ?', 5, function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            let managerData = {
                name: results[i].first_name + " " + results[i].last_name,
                value: {
                    id: results[i].id
                }
            }
            managerChoices.push(managerData);
        }
    })

    db.query('SELECT * FROM roles', function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let roleData = {
                name: results[i].title,
                value: {
                    id: results[i].id
                }
            }
            console.log(roleData)
            roleChoices.push(roleData);
        }
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the first name?',
                name: 'firstName',
                validate: input => { return !input ? "Please enter your name" : true }
            },
            {
                type: 'input',
                message: 'What is the last name?',
                name: 'lastName',
                validate: input => { return !input ? "Please enter your name" : true }
            },
            {
                type: 'list',
                message: 'What is their role?',
                choices: roleChoices,
                name: 'roleID',
            },
            {
                type: 'list',
                message: `Who is the manager?`,
                choices: managerChoices,
                name: 'managerID',
            }
        ])
            .then((answers) => {
                const { firstName, lastName, roleID, managerID } = answers;
                console.log(roleID);

                db.query(
                    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", ${roleID.id}, ${managerID.id})`, function (err, results) {
                        if (err) throw err;
                        console.log("Successfully added");
                        mainMenu()
                    })
            })
    })

}

updateEmployee = () => {
    let employeeArray = [];
    let roleChoices = [];

    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            let employeeData = {
                name: results[i].first_name + " " + results[i].last_name,
                value: {
                    id: results[i].id
                }
            }
            employeeArray.push(employeeData);
        }
    })
    db.query('SELECT * FROM roles', function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let roleData = {
                name: results[i].title,
                value: {
                    id: results[i].id,
                    salary: results[i].salary,
                }
            }
            roleChoices.push(roleData);
        }
        inquirer.prompt([
            {
                type: 'list',
                message: 'Select the employee',
                choices: employeeArray,
                name: 'employee',
            },
            {
                type: 'list',
                message: 'What is their new role?',
                choices: roleChoices,
                name: 'role'
            },

        ])
            .then((answers) => {
                const { employee, role } = answers;
                console.log(role)
                console.log(employee)

                db.query(`UPDATE employee SET role_id = ${role.id} WHERE id = ${employee.id}`, function (err, results) {
                    if (err) throw err;
                    console.log("Successfully changed");
                    mainMenu()
                })
            })
    })
}

//*Bonus: update employee managers, 
// // *View employees by Manager, 
// // *View employees by department, 
// // *delete departments/roles/employees, 
// // *view combined salaries of all employees in a department 

updateManager = () => {
    let employeeArray = [];
    let managerChoices = [{
        name: "none",
        value: {
            id: null
        }
    }];
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            let employeeData = {
                name: results[i].first_name + " " + results[i].last_name,
                value: {
                    id: results[i].id
                }
            }
            employeeArray.push(employeeData);
        }
    })
    db.query('SELECT * FROM employee WHERE role_id = ?', 5, function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            let managerData = {
                name: results[i].first_name + " " + results[i].last_name,
                value: {
                    id: results[i].id
                }
            }
            managerChoices.push(managerData);
        }
        inquirer.prompt([
            {
                type: 'list',
                message: 'Select the employee',
                choices: employeeArray,
                name: 'chosenEmployee'
            },
            {
                type: 'list',
                message: 'Select the manager',
                choices: managerChoices,
                name: 'chosenManager'
            }
        ])
            .then((answer) => {
                const { chosenEmployee, chosenManager } = answer;

            })
    })
}

employeeByManager = () => {
    let managerChoices = [];

    db.query('SELECT * FROM employee WHERE role_id = ?', 5, function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            let managerData = {
                name: results[i].first_name + " " + results[i].last_name,
                value: {
                    id: results[i].id
                }
            }
            managerChoices.push(managerData);
        }
        inquirer.prompt([
            {
                type: 'list',
                message: 'Please select the manager',
                choices: managerChoices,
                name: 'manager'
            }
        ])
            .then((answer) => {
                const { manager } = answer;

                db.query(`SELECT * FROM employee WHERE manager_id = ?`, manager.id, function (err, results) {
                    if (err) throw err
                    console.table(results)
                    mainMenu();
                })

            })
    })
}

employeeByDepartment = () => {
    let department = [];

    db.query('SELECT * from department', function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let departmentData = {
                name: results[i].nameOfDepartment,
                value: {
                    id: results[i].id
                }
            }
            department.push(departmentData);
        }
        inquirer.prompt([
            {
                type: 'list',
                message: 'Select the department to view employees',
                choices: department,
                name: 'choice'
            }
        ])
            .then((answer) => {
                const { choice } = answer;

                db.query(`SELECT * FROM employee WHERE role_id = ?`, choice.id, function (err, results) {
                    if (err) throw err
                    console.table(results)
                    mainMenu();
                })

            })
    })
}

salaryByDepartment = () => {
    let department = [];

    db.query('SELECT * from department', function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let departmentData = {
                name: results[i].nameOfDepartment,
                value: {
                    id: results[i].id
                }
            }
            department.push(departmentData);
        }
        inquirer.prompt([
            {
                type: 'list',
                message: 'Select the department to view employees',
                choices: department,
                name: 'choice'
            }
        ])
            .then((answer) => {
                const { choice } = answer;

                db.query(`SELECT SUM(roles.salary) AS TotalSalary FROM employee JOIN roles on employee.role_id = roles.id WHERE department_id = ?`, choice.id, function (err, results) {
                    if (err) throw err
                    console.table(results)
                    mainMenu();
                })

            })
    })
}

deleteSomething = () => {

    let employeeArray = [];
    let roleChoices = [];
    let departmentArray = [];
    db.query('SELECT * from department', function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let departmentData = {
                name: results[i].nameOfDepartment,
                value: {
                    id: results[i].id
                }
            }
            departmentArray.push(departmentData);
        }
    })
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            let employeeData = {
                name: results[i].first_name + " " + results[i].last_name,
                value: {
                    id: results[i].id
                }
            }
            employeeArray.push(employeeData);
        }
    })
    db.query('SELECT * FROM roles', function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let roleData = {
                name: results[i].title,
                value: {
                    id: results[i].id,
                    salary: results[i].salary,
                }
            }
            roleChoices.push(roleData);
        }

        inquirer.prompt([
            {
                type: 'list',
                message: 'Please select what you would like to remove',
                choices: ['Employee', 'Department', 'Roles'],
                name: 'choice'
            }
        ])
            .then((answer) => {
                const { choice } = answer;

                switch (choice) {
                    case 'Employee':
                        inquirer.prompt([

                            {
                                type: 'list',
                                message: 'Please select the employee you would like to remove',
                                choices: employeeArray,
                                name: 'employeeChoice'
                            }
                        ])
                            .then((answer) => {
                                const { employeeChoice } = answer;
                                db.query(`DELETE FROM employee WHERE id = ${employeeChoice.id}`, function (err, results) {
                                    if (err) throw err;
                                    console.log("Removed")
                                    mainMenu();
                                })
                            })
                        break;
                    case 'Department':
                        inquirer.prompt([

                            {
                                type: 'list',
                                message: 'Please select the department you would like to remove',
                                choices: departmentArray,
                                name: 'departmentChoice'
                            }
                        ])
                            .then((answer) => {
                                const { departmentChoice } = answer;
                                db.query(`DELETE FROM department WHERE id = ${departmentChoice.id}`, function (err, results) {
                                    if (err) throw err;
                                    console.log("Removed")
                                    mainMenu();
                                })
                            })
                        break;
                    case 'Roles':
                        inquirer.prompt([

                            {
                                type: 'list',
                                message: 'Please select the role you would like to remove',
                                choices: roleChoices,
                                name: 'roleChoice'
                            }
                        ])
                            .then((answer) => {
                                const { roleChoice } = answer;
                                db.query(`DELETE FROM roles WHERE id = ${roleChoice.id}`, function (err, results) {
                                    if (err) throw err;
                                    console.log("Removed")
                                    mainMenu();
                                })
                            })
                        break;
                }
            })

    })



}

welcomeMessage()

