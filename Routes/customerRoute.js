const express=require('express');
const router=express.Router();
const connection=require("../utilis/sqlConnection");
const {defaultRoute,register,check_eligibility,create_loan,make_payment,view_loan,view_statement}=require("../Controllers/customerController")

router.get('/',defaultRoute)
router.post('/register',register)

router.get('/check_eligibility',check_eligibility)
router.post('/create-loan',create_loan)

router.get('/view-loan/:loan_id',view_loan)

router.patch('/make-payment/:customer_id/:loan_id',make_payment)

router.get('/view-statement/:customer_id/:loan_id',view_statement)


module.exports=router;