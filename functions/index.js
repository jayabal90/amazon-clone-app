const functions = require('firebase-functions');
const express=require('express');
const cors =require('cors');
const stripe= require('stripe')('sk_test_51HvngWC3r664hoCFb4QK27aqwC834c8L0NncnKFkvTlkCxHvv2W84gvdbm8Dov8KdWINPwAbrZK5UjtHcxKH2hAu00823DLkqD')

// API
        
// App config
const app =express();

//Middlewares
app.use(cors({origins:true}));
app.use(express.json());

//API routes
app.get('/', (request,response)=>response.status(200).send(
    'hello world'
));

app.post('/payments/create', async(request, response) => {
    const total=request.query.total;
    console.log("Payment received for this amount >>>>",total);
    const paymentIntent= await stripe.paymentIntents.create({
        amount:total, // subunits of currency
        currency:"inr",
    });
    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    });
});

// Listen Command
exports.api=functions.https.onRequest(app)

