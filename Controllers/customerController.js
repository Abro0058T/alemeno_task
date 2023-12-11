
const connection=require('../utilis/sqlConnection')
const today=new Date()
exports.defaultRoute=(req,res)=>{
    console.log(" working /")
    res.status(200).send("working /")
}
 exports.register=(req,res)=>{
    const {first_name,last_name,age,monthly_income,phone_number}=req.body;
    var id;
    connection.query(`SELECT COUNT(*) as count from customer_data`,(error,results)=>{
        if(error){
            console.log(error);
            res.status(500).json({error:error});
        }
        else{
            id=results[0].count+1;
            approve_limit=(36*monthly_income)/100000
            connection.query(`INSERT INTO customer_data value("${id}","${first_name}","${last_name}","${age}","${phone_number}","${monthly_income}","${approve_limit}");`,(error,results)=>{
                if(error){
                    console.log(error);
                    res.status(500).json({error:error});
                }
                else{
                    res.status(200).json({"customer_id":id,"name":first_name+" "+last_name,"age":age,"monthly_income":monthly_income,"approve_limit":approve_limit,"phone_number":phone_number});
                }
            })
        }
    })

   }

exports.check_eligibility=(req,res)=>{
    const {customer_id,loan_amount,interest_rate,tenure}=rew.body;
    // Number of times past load is paid on time (PT)(w1=0.4)
    // select TIMESTAMPDIFF(MONTH,str_to_date(start_date,'%d/%m/%Y'),str_to_date(end_date,'%d/%m/%Y')),loan_id from loan_data where customer_id=2;
    // number of loan taken in past(NL)(w2=0.2)
    // select Count(*) from loan_data where customer_id='8';
    // loan activity in current year
    // loan approved volume(LA)(w3=0.3)
    // select sum(loan_amount) from loan_data where customer_id='8';
    if(credit_score>50){
        console.log('approve')
    }
    else if(credit_score<50 && credit_score>30 && interest_rate>12){
        console.log("loan approved")
    }
    else if(create_loan>10&& this.create_loan<30 && interest_rate>16){
        console.log("loan approved")
    }
    else if(credit_score<10){
        console.log("loan not approved")
    }
    else if (sum_emi>(0.5*monthly_salary)){
        console.log("don't approve loan")
    }
    // else if(){
        
    // }

    console.log(" check_eligibility /")
    res.status(200).send("check_eligibility /")
}
exports.create_loan=(req,res)=>{
    const {customer_id,loan_amount,interest_rate,tenure}=req.body;
    connection.query(`SELECT MAX(loan_id) as count from loan_data`,(error,results)=>{
        if(error){
            console.log(error);
            res.status(500).json({error:error});
        }
        else{
            const monthly_payment=loan_amount/tenure;
            const y=today.getFullYear();
            const m=today.getMonth();
            const d=today.getDate();
            const start_date=d+'/'+m+'/'+y;
            const end_year=y+tenure/12;
            const end_month=tenure%12+m;
            console.log(results[0].count)
            const loan_id=parseInt(results[0].count)+1;
            const end_date=d+'/'+end_month+'/'+end_year;
            // insert into loan_data value('9997','','true','NULL','400000');
            connection.query(`insert into loan_data value('${customer_id}','${loan_id}','${loan_amount}','${tenure}','${interest_rate}','${monthly_payment}','0','${start_date}','${end_date}');
            `,(error,results)=>{
                if(error){
                    console.log(error);
                    res.status(500).json({error:error});
                }
                else{
                    // insert into loan_data value('9997','','true','NULL','400000');
                    console.log(results)
                    res.status(200).json({
                        'loan_id':loan_id,'customer_id':customer_id,'loan_approved':true,"message":null,monthly_payment
                    })
                }
            })
  
        }
    })
}

exports.view_loan=(req,res)=>{
const {loan_id}=req.params;
connection.query(`select * from loan_data  inner join  customer_data on loan_data.customer_id =customer_data.customer_id where loan_data.loan_id='${loan_id}';

`,(error,results)=>{
    if(error){
        console.log(error);
        res.status(500).json({error:error});
    }
    else{
        const{customer_id,loan_id,loan_amount,tenure,interest_rate,monthly_payment,first_name,last_name,age,phone_number}=results[0];
        res.status(200).json({
            loan_id,
            "custome":{
                customer_id,first_name,last_name,phone_number,age
            },
            loan_amount,
            interest_rate,
            "monthly_installement":monthly_payment,
            tenure
        })
    }

})



}

exports.make_payment=(req,res)=>{
    console.log(" make_payment /")
    res.status(200).send("make_payment /")
}
// new emi = ((loan+intrest)-(emi_on_time*emi+current))/ternure-number_of_emi_paid.
// select ((loan_amount*(1+18/100)-(monthly_payment*TIMESTAMPDIFF(MONTH,str_to_date(start_date,'%d/%m/%Y'),str_to_date(now(),'%d-%m-%Y')))/(tenure-TIMESTAMPDIFF(MONTH,str_to_date(start_date,'%d/%m/%Y'),str_to_date(end_date,'%d/%m/%Y'))) from loan_data where loan_id='9996;


exports.view_statement=(req,res)=>{
    console.log(" view_statement /")
    res.status(200).send("view_statement /")
}
