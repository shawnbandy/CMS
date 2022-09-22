const { default: inquirer } = require("inquirer");

const express = require('express');
const inquirer = require('inquirer');
const mysql = require('12');
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
        password: '',
        database: 'classlist_db'
      },
      console.log(`Connected to the classlist_db database.`)
);


//*main menu selection to bounce between separate options
//!may have to put bonus stuff in here if I have time? will figure out when I cross that bridge
const mainMenu = () => {
    let choiceSelection;
    return inquirer.prompt([
        {
            type: 'list',
            message: 'Please select one of the following options below:', 
            choices: ['View all roles', 'View all departments', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
            name: 'selection'
        }
    ])
    .then((answer) => {
        const {choice} = answer
        switch (choice){
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
            
        }
        return choiceSelection;
    })
}

const viewRoles = () => {

}

const viewDepartments = () => {
    
}

const viewEmployees = () => {
    
}


//*FOR this Im thinking to use the db.stuff found in assignment 21 line 27
//*basically get all of the inputs in an inquirer, then use the .then() to deconstruct the object and add to the db
const addDepartment = () => {
    
}

const addRole = () => {
    
}

const addEmployee = () => {
    
}

const updateEmployee = () => {
    
}