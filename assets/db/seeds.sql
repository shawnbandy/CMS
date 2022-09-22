

INSERT INTO department (nameOfDepartment)
VALUES ("Bakery"),
        ("Deli"),
        ("Produce"),
        ("Butcher"),
        ("Management");

INSERT INTO roles (title, salary, department_id)
VALUES ("Baker", 45000.00, 1),
        ("Deli Worker", 45000.00, 2),
        ("Stocker", 40000.00, 3),
        ("Butcher", 55000.00, 4),
        ("Manager", 70000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Manager", 5, NULL),
        ("Sarah", "Baker", 1, 1),
        ("Jamie", "Stock", 3, 1),
        ("Allie", "Deli", 2, 1),
        ("Butch", "Derr", 4, 1);


