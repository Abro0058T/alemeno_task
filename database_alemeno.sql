CREATE DATABASE alemeno_bank;

use alemeno_bank;

CREATE TABLE customer_data(
    customer_id varchar(20) PRIMARY KEY,
    first_name varchar(100),
    last_name varchar(100),
    age int ,
    phone_number varchar(20),
    monthly_salary decimal(20,2),
    approve_limit int 
);

LOAD DATA INFILE 'customer_data.csv';

