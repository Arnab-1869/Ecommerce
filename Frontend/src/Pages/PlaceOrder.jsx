import React, { useContext, useState } from "react";
import Title from "../Components/Title";
import CartTotal from "../Components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
const PlaceOrder = () => {
  const [method, setmethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setcartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [formData, setformData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    state: "",
    zipcode: "",
    country: "",
    city: "",
    phone: "",
  });
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setformData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      switch (method) {
        case "cod": {
          const response = await axios.post(
            backendUrl + "/api/order/place",
            {
              address: formData,
              items: orderItems,
              amount: getCartAmount() + delivery_fee,
            },
            { headers: { token } }
          );
          if (response.data.success) {
            setcartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        case "stripe": {
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            {
              address: formData,
              items: orderItems,
              amount: getCartAmount() + delivery_fee,
            },
            { headers: { token } }
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;
        }
       
        default:
          break;
      }
      
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 px-3.5 py-1.5 w-full rounded "
            type="text"
            placeholder="First Name"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 px-3.5 py-1.5 w-full rounded "
            type="text"
            placeholder="Second Name"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 px-3.5 py-1.5 w-full rounded "
          type="email"
          placeholder="Email address"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 px-3.5 py-1.5 w-full rounded "
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 px-3.5 py-1.5 w-full rounded "
            type="text"
            placeholder="City"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 px-3.5 py-1.5 w-full rounded "
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 px-3.5 py-1.5 w-full rounded "
            type="number"
            placeholder="Zipcode"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 px-3.5 py-1.5 w-full rounded "
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 px-3.5 py-1.5 w-full rounded "
          type="number"
          placeholder="Phone"
        />
      </div>
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="flex justify-center gap-3 flex-col lg:flex-row">
          
            <div
              onClick={() => setmethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4 ">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button
              className="bg-black text-white px-16 py-3 text-sm"
              type="submit"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
