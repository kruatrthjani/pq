//paymentController.js
try{
//
require('dotenv').config();
//const { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } = process.env;
const STRIPE_PUBLISHABLE_KEY='pk_test_51P15i4SGXDPzpYYjEAuZjuSX7aAwG5JLSvj1hy0b9yiuLfVzYKiOAgPmCJM2ppH2bEf76sj1lksW7F8oMxrePdeB00Nfd5NrxX'
const STRIPE_SECRET_KEY='sk_test_51P15i4SGXDPzpYYjoe9zKxTCWu1SMCLjkJhnsbVRKl2dI1I98MxotxNQx2L4CwCR4KGWnMPvwmJ25LN2GRpr5V7m00NjThp9o0'

console.log(STRIPE_PUBLISHABLE_KEY)
console.log(STRIPE_SECRET_KEY)
const stripe = require('stripe')(STRIPE_SECRET_KEY)
}catch(error){
    console.error(error)
}
const createCustomer = async(req,res)=>{

    try {

        const customer = await stripe.customers.create({
            name:req.body.name,
            email:req.body.email,
        });

        res.status(200).send(customer);

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}

const addNewCard = async (req, res) => {
    try {
        const {
            customer_id,
            card_Name,
            card_ExpYear,
            card_ExpMonth,
            card_CVC,
        } = req.body;

        // Use test card number
        const testCardNumber = '4242424242424242';

        // Create a token using test card information
        const card_token = await stripe.tokens.create({
            card: {
                name: card_Name,
                number: testCardNumber,
                exp_year: card_ExpYear,
                exp_month: card_ExpMonth,
                cvc: card_CVC
            }
        });

        // Create a card source for the customer using the test token
        const card = await stripe.customers.createSource(customer_id, {
            source: card_token.id
        });

        res.status(200).send({ card: card.id });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const createCharges = async(req,res)=>{

    try {

        const createCharge = await stripe.charges.create({
            receipt_email: 'pubgsgreat083@gmail.com',
            amount: parseInt(req.body.amount)*100, //amount*100
            currency:'INR',
            card: req.body.card_id,
            customer: req.body.customer_id
        });

        res.status(200).send(createCharge);

    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }

}


module.exports = {
    createCustomer,
    addNewCard,
    createCharges
}