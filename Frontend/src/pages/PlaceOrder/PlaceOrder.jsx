import React, { useContext, useState, useEffect } from 'react'
import './PlaceOrder.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import Loader from '../../components/Loader/Loader'
import orderSuccessSound from '../../assets/orderSuccess.wav'


const PlaceOrder = () => {
  const { getTotalCartAmount, Token, food_list, cartItems, url } = useContext(StoreContext);
  const [LoaderP, setLoaderP] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); // 'online' or 'cod'
  const navigate = useNavigate();


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  const [Data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
    utr: "",

  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(Data => ({ ...Data, [name]: value }))

  }
  const placeOrder = async (event) => {
    event.preventDefault();
    setLoaderP(true);

    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      setLoaderP(false);
      return;
    }
    if (paymentMethod === 'online' && !Data.utr) {
      toast.error("Please enter UTR number for online payment.");
      setLoaderP(false);
      return;
    }
    if (paymentMethod === "cod") {
      setData(prevData => ({ ...prevData, utr: "" }));
    }

    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    let orderData = {
      address: Data,
      items: orderItems,
      amount: getTotalCartAmount() + 30,
      paymentMethod: paymentMethod

    }

    try {

      let response = await axios.post(`${url}/api/order/place`, orderData, { headers: { Token } });
      setLoaderP(false);

      if (response.data.success && Data.phone && Data.email && Data.firstName && Data.city) {
        
         const audio = new Audio(orderSuccessSound);
         audio.play();
        
        // Wait 500ms to allow sound to start before alert
        setTimeout(() => {
          navigate('/order-success');
        }, 600);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("An error occurred. Please try again.");
    }
  }
  const copyText = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Text Copied")

  }

  useEffect(() => {
    if (!Token) {
      navigate('/cart')
    }

  }, [Token])



  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={Data.firstName} type="text" placeholder='First name' />
          <input required name='lastName' onChange={onChangeHandler} value={Data.lastName} type="text" placeholder='Last name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={Data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={Data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={Data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={Data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={Data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={Data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={Data.phone} type="text" placeholder='Phone no' />
        {paymentMethod === 'cod' ? <></> :
          <>
            <input required name='utr' onChange={onChangeHandler} value={Data.utr} type="text" placeholder='Enter UTR number after payment' />
          </>}

      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              {
                getTotalCartAmount() > 0 ? <p>₹{30}</p> : <p>₹0</p>
              }
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              {getTotalCartAmount() > 0 ? <b>₹{getTotalCartAmount() + 30}</b> : <b>₹0</b>}
            </div>
            <h4 style={{ "margin-top": "10px" }}>Payment Mode 👇</h4>
            <div className='payment-option'>
              <div className='online' onClick={() => setPaymentMethod('online')} style={{ cursor: 'pointer' }}>
                <label htmlFor="Online" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    name="payment"
                    id="Online"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                  />
                  <span>Online</span>
                </label>
              </div>

              <div className='COD' onClick={() => setPaymentMethod('cod')} style={{ cursor: 'pointer' }}>
                <label htmlFor="COD" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    name="payment"
                    id="COD"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>


            {paymentMethod != 'cod' ?
              <div className='payment'>
                {paymentMethod === "online" ? (<><img src={assets.QR_code} alt="" />
                  <div className="payupi">
                    <b>Or</b>
                    <div className='phonepay'><img src={assets.Phone_pay} alt="" /><p>9175702325@ybl</p><img src={assets.Copy} onClick={() => copyText("9175702325@ybl")} className='Copy' alt="" /></div>

                    <div className='Googlepay'><img src={assets.Googlepay} alt="" /><p>9175702325@ibl</p><img src={assets.Copy} onClick={() => copyText("9175702325@ibl")} className='Copy' alt="" /></div>
                  </div></>) : (<></>)}

              </div>
              :
              <></>}
          </div>



          {/* // Confirm button will trigger the form submission and run placeOrder */}
          {LoaderP ? <><p>Please do not go back order is placing.</p><Loader /></> : <button className='confirm'>Confirm</button>}



        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
