const inquirer = require('inquirer')
const cTable = require('console.table');
const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3005;

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

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
//!may have to put bonus stuff in here if I have time? will figure out when I cross that bridge
welcomeMessage = () => {
    return inquirer.prompt([
        {
            type: 'confirm',
            message: "Welcome! Would you like to access the database?",
            name: "confirm"
        }
    ])
    .then((answer) =>{
        if (answer.confirm == true){
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
            choices: ['View all roles', 'View all departments', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit'],
            name: 'selection'
        }
    ])
    .then((answer) => {
        const {selection} = answer
        switch (selection){
            case 'View all roles' :
                choiceSelection = viewRoles();
                break;

            case 'View all departments' :
                choiceSelection = viewDepartments();
                break;

            case 'View all employees' :
                choiceSelection = viewEmployees();
                break;

            case 'Add a department' :
                choiceSelection = addDepartment();
                break;

            case 'Add a role' :
                choiceSelection = addRole();
                break;

            case 'Add an employee' :
                choiceSelection = addEmployee();
                break;
        
            case 'Update an employee role' :
                choiceSelection = updateEmployee();
                break;   
            case 'Quit' :
                choiceSelection = "Goodbye";
                break;
            
        }
        return (choiceSelection == "Goodbye" ? console.log(choiceSelection) : choiceSelection);
    })
}

viewRoles = () => {
    db.query('SELECT * FROM roles', function (err, results) {
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
    db.query('SELECT * FROM employee', function (err, results) {
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
            validate: input => { return !input ? "Please answer the question" : true}
        }    
    ])
    .then((answers) => {
        const {departmentName} = answers;
        db.query(
            `INSERT INTO department (nameOfDepartment) VALUES ("${departmentName}")`, function (err, results) {
            console.table("Added!");
            mainMenu()
        })
    })
}

addRole = () => {

    let department = [];

    db.query('SELECT * from department', function(err, results) {
        for(let i = 0; i < results.length; i++){
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
                validate: input => { return !input ? "Please answer the question" : true}
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
            const {roleTitle, roleSalary, roleDepartment} = answers;
            db.query(
                `INSERT INTO roles (title, salary, department_id) VALUES ("${roleTitle}", ${roleSalary}, ${roleDepartment.id})`, function (err, results) {
                if (err) throw err;
                console.log("Successfully added");
                mainMenu();
            })
        })
    })

}

addEmployee = () => {

    let roleChoices = [];
    let managerChoices = [];

    db.query('SELECT * FROM employee WHERE role_id = ?', 5, function(err, results) {
        if (err) throw err;
        for(let i = 0; i < results.length; i++){
            let managerData = {
                name: results[i].first_name + " " + results[i].last_name,
                value: {
                    id: results[i].id
                }
            }
            managerChoices.push(managerData);
        }
    })

    db.query('SELECT * FROM roles', function (err, results){
        for(let i = 0; i < results.length; i++){
            let roleData = {
                name: results[i].title,
                value: {
                    id: results[i].department_id
                }
            }
            roleChoices.push(roleData);
        }
        inquirer.prompt([
            {
                type: 'input',
                message: 'What is the first name?',
                name: 'firstName',
                validate: input => { return !input ? "Please enter your name" : true}
            },
            {
                type: 'input',
                message: 'What is the last name?',
                name: 'lastName',
                validate: input => { return !input ? "Please enter your name" : true}
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
            const {firstName, lastName, roleID, managerID} = answers;

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
    
}

welcomeMessage()



    // db.query(`DELETE FROM course_names WHERE id = ?`, 3, (err, result) => {
    //     if (err) {
    //       console.log(err);
    //     }
    //     console.log(result);
    //   });