
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import './Payment.css'
import { useStateValue } from './StateProvider';
import { CardElement,useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from './axios';
import { db } from './firebase';

function Payment() {
    const history=useHistory();
    const [{basket,user},dispatch]=useStateValue();

    const stripe=useStripe();
    const elements=useElements();

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() => {
        // generate the special stripe secret which allows us to change customer
        const getClientSecret = async () =>{
            const response =await axios({
                method:'post',
                // stripe expects the total in a currencies submits
                url:`/payments/create?total=${getBasketTotal(basket) *100}`
            });
            setClientSecret(response.data.clientSecret)
        }
        getClientSecret();
    }, [basket])

    console.log("the secret is >>>",clientSecret)

    const handleSubmit = async (e) =>{
        // stripe stuff
        e.preventDefault();
        setProcessing(true);
        const payload = await stripe.confirmCardPayment(clientSecret,{
            payment_method:{
                card:elements.getElement(CardElement)
            }
        }).then(({paymentIntent}) =>{
            //paymentIntent=payment confirmation
            db
             .collection('users')
             .doc(user?.uid)
             .collection('orders')
             .doc(paymentIntent.id)
             .set({
                 basket:basket,
                 amount:paymentIntent.amount,
                 created:paymentIntent.created
             });
            setSucceeded(true);
            setError(null);
            setProcessing(false);
            dispatch({
                type:'EMPTY_BASKET'
            })
            history.replace('/orders')
        })
        
    }
    const handleChange = e=>{
        // customer card details
        setDisabled(e.empty);
        setError(e.error ? e.error.message :"");
    }
    return (
        <div className="payment">
            <div className="payment_container">
                <h1>Checkout (<Link to="checkout">{basket?.length} items</Link>)</h1>
                {/* delivery Address */}
                <div className="payment_section">
                    <div className="payment_title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment_address">
                        <p>{user?.email}</p>
                        <p>West Street New Colony</p>
                        <p>Malaikottalam</p>
                    </div>
                </div>
                 {/* Review Item */}
                <div className="payment_section">
                    <div className="payment_title">
                        <h3>Review and item order</h3>
                    </div>
                    <div className="payment_items">
                       {/* order item  */}
                       {basket.map(item => (
                        <CheckoutProduct 
                            id={item.id}
                            title={item.title}
                            image={item.image}
                            price={item.price}
                            rating={item.rating}
                        />
                        ))}
                    </div>
                </div>
                 {/* Payment method */}
                <div className="payment_section">
                    <div className="payment_title">
                        <h3>Payment Method</h3>
                    </div>
                    <div className="payment_details">
                        {/* Stripe integration */}
                        <form  onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange}/>
                            <div className="payment_priceContainer">
                                <CurrencyFormat
                                    renderText={(value) => (
                                    <h3>Order Total: {value}</h3>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)} // Part of the homework
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"₹"}
                                />
                                <button disabled={processing || disabled || succeeded}>
                                    <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                                </button>
                            </div>
                            {/* Error */}
                            {error && <div>{error}</div>}
                        </form>
                    </div>       
                </div>
            </div>
        </div>
    )
}

export default Payment
