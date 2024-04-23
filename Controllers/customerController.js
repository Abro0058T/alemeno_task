
const connection = require('../utilis/sqlConnection')
const today = new Date()
exports.defaultRoute = (req, res) => {
    console.log(" working /")
    res.status(200).send("working /")
}
exports.register = (req, res) => {
    const { first_name, last_name, age, monthly_income, phone_number } = req.body;
    var id;
    connection.query(`SELECT COUNT(*) as count from customer_data`, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
        else {
            id = results[0].count + 1;
            approve_limit = (36 * monthly_income) / 100000
            connection.query(`INSERT INTO customer_data value("${id}","${first_name}","${last_name}","${age}","${phone_number}","${monthly_income}","${approve_limit}");`, (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: error });
                }
                else {
                    res.status(200).json({ "customer_id": id, "name": first_name + " " + last_name, "age": age, "monthly_income": monthly_income, "approve_limit": approve_limit, "phone_number": phone_number });
                }
            })
        }
    })

}

exports.check_eligibility = (req, res) => {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;
    connection.query(`select SUM(if(str_to_date(loan.end_date,'%d/%m/%Y')<=CURDATE(),1,0)) as past_loan ,Count(*) as no_loan ,SUM(if(YEAR(str_to_date(loan.start_date,'%d/%m/%Y'))=YEAR(CURDATE()),1,0)) as loan_activity,SUM(loan.loan_amount) as loan_volume ,SUM(loan.monthly_payment) as monthly_payment, loan.customer_id,customer.monthly_salary from loan_data as loan, customer_data as customer where loan.customer_id='${customer_id}'and customer.customer_id='${customer_id}';
    `, (error, results) => {
        if(results[0].monthly_payment > (0.5 * results[0].monthly_salary)){
            res.status(200).send("Loan not approved")
        }
        if (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
        else {
            console.log(results)
            const credit_score = 5 * results[0].past_loan + 0.7 * results[0].no_loan + 5 * results[0].loan_activity + 2 * results[0].loan_activity / 100000;
            if (results[0].monthly_payment > 0.5 * results[0].monthly_salary) {
                res.status(200).send("loan not approved");
            }
            else {
                if (credit_score > 50) {
                    res.status(200).json({
                        customer_id,
                        "approval": true,
                        interest_rate,
                        "correct_intrest_rate": interest_rate,
                        tenure,
                        monthly_installement: loan_amount * (1 + interest_rate / 100) / tenure
                    })
                }
                else if (credit_score < 50 && credit_score > 30 && interest_rate > 12) {
                    res.status(200).json({
                        customer_id,
                        "approval": true,
                        interest_rate,
                        "correct_intrest_rate": 14,
                        tenure,
                        monthly_installement: loan_amount * (1 + 14 / 100) / tenure
                    })
                }
                else if (credit_score > 10 && this.credit_score < 30 && interest_rate > 16) {
                    res.status(200).json({
                        customer_id,
                        "approval": true,
                        interest_rate,
                        "correct_intrest_rate": 16,
                        tenure,
                        monthly_installement: loan_amount * (1 + 16 / 100) / tenure
                    })
                }
                else if (credit_score < 10) {
                    res.status(200).send("loan not approved")
                }
                else{
                    res.status(200).send("loan not approved")
                }
            }
        }

    })
}
exports.create_loan = (req, res) => {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;
    connection.query(`SELECT MAX(loan_id) as count from loan_data`, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
        else {
            const monthly_payment = loan_amount / tenure;
            const y = today.getFullYear();
            const m = today.getMonth();
            const d = today.getDate();
            const start_date = d + '/' + m + '/' + y;
            const end_year = y + tenure / 12;
            const end_month = tenure % 12 + m;
            console.log(results[0].count)
            const loan_id = parseInt(results[0].count) + 1;
            const end_date = d + '/' + end_month + '/' + end_year;
            // insert into loan_data value('9997','','true','NULL','400000');
            connection.query(`insert into loan_data value('${customer_id}','${loan_id}','${loan_amount}','${tenure}','${interest_rate}','${monthly_payment}','0','${start_date}','${end_date}');
            `, (error, results) => {
                if (error) {
                    console.log(error);
                    res.status(500).json({ error: error });
                }
                else {
                    // insert into loan_data value('9997','','true','NULL','400000');
                    console.log(results)
                    res.status(200).json({
                        'loan_id': loan_id, 'customer_id': customer_id, 'loan_approved': true, "message": null, monthly_payment
                    })
                }
            })

        }
    })
}

exports.view_loan = (req, res) => {
    const { loan_id } = req.params;
    connection.query(`select * from loan_data  inner join  customer_data on loan_data.customer_id =customer_data.customer_id where loan_data.loan_id='${loan_id}';

`, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
        else {
            const { customer_id, loan_id, loan_amount, tenure, interest_rate, monthly_payment, first_name, last_name, age, phone_number } = results[0];
            res.status(200).json({
                loan_id,
                "custome": {
                    customer_id, first_name, last_name, phone_number, age
                },
                loan_amount,
                interest_rate,
                "monthly_installement": monthly_payment,
                tenure
            })
        }

    })
}

exports.make_payment = (req, res) => {
    const { loan_id } = req.params;
    const { amount } = req.body;
    connection.query(`update loan_data ,(select  (loan_amount*(1+intrest_rate/100)-(monthly_payment*TIMESTAMPDIFF(MONTH,str_to_date(start_date,'%d/%m/%Y'),CURDATE())+${amount}))/TIMESTAMpDIFF(MONTH,CURDATE(),str_to_date(end_date,'%d/%m/%Y')) as data from loan_data where loan_id='${loan_id}')  as new set loan_data.monthly_payment=new.data where loan_data.loan_id='${loan_id}';`, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
        else {
            console.log(results);
            res.status(200).send("Emi updated")
        }

    })
}
exports.view_statement = (req, res) => {
    const { customer_id, loan_id } = req.params;
    connection.query(`select customer_id,loan_id,loan_amount*intrest_rate as principle,intrest_rate,monthly_payment*emi_on_time as amount_paid,monthly_payment,tenure-emi_on_time,emi_on_time from loan_data where customer_id='${customer_id} and loanid=${loan_id}';
    `, (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: error });
        }
        else {
            res.status(200).json(results)
        }

    })
}
