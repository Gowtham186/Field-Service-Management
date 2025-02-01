import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import { customerLogin, getUserProfile, verifyOtpApi } from "../redux/slices.js/user-slice";
import { useNavigate } from "react-router-dom";

export default function CustomerLogin({ closeLogin }) {
  const [phone_number, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [openOtpForm, setOpenOtpForm] = useState(false);
  const [clientErrors, setClientErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errors = {};
  const { serverError } = useSelector((state) => state.user);
  const formRef = useRef(null); 

  // Close the login form if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        closeLogin(); // Close the form if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeLogin]);

//   useEffect(()=>{
//     localStorage.setItem('customerLogin', JSON.stringify({phone_number, otp}))
//   },[phone_number, otp])

  const runClientValidations = () => {
    if (!phone_number) {
      errors.phone_number = "Phone number is required";
    } else if (!validator.isNumeric(phone_number)) {
      errors.phone_number = "Phone number should contain only digits";
    } else if (phone_number.length !== 10) {
      errors.phone_number = "Phone number must be exactly 10 digits";
    }
  };

  const otpClientValidations = () => {
    if (!otp) {
      errors.otp = "OTP is required";
    } else if (!validator.isNumeric(otp)) {
      errors.otp = "OTP should contain only numbers";
    } else if (otp.length !== 4) {
      errors.otp = "OTP must be exactly 4 digits";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    runClientValidations();

    if (Object.keys(errors).length !== 0) {
      setClientErrors(errors);
    } else {
      try {
        setClientErrors({});
        await dispatch(customerLogin({ phone_number })).unwrap();
        //localStorage.removeItem('customerLogin')
        setOpenOtpForm(true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    otpClientValidations();

    const verifyOtpData = { 
        identifier : phone_number,
        otp : otp
    }
    const resetForm = ()=>{
        setPhoneNumber('')
        setOtp('')
    }
    if (Object.keys(errors).length !== 0) {
      setClientErrors(errors);
    } else {
        try{
            setClientErrors({});
            await dispatch(verifyOtpApi({verifyOtpData, resetForm})).unwrap();
            await dispatch(getUserProfile()).unwrap();
            closeLogin()
            navigate("/");
        }catch(err){
            console.log(err)
        }
      
    }
  };

  return (
    <div
      ref={formRef}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-6 w-96 text-center z-50"
    >
      <h2 className="text-2xl font-semibold mb-4">Customer Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-left text-gray-700 font-medium">Phone Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phone_number}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setClientErrors((prev) => ({ ...prev, phone_number: null }));
            }}
          />
          {clientErrors.phone_number && (
            <p className="text-red-500 text-xs text-left">{clientErrors.phone_number}</p>
          )}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Send OTP
        </button>
      </form>

      {openOtpForm && (
        <form onSubmit={verifyOtp} className="space-y-4 mt-4">
          <div>
            <label className="block text-left text-gray-700 font-medium">Enter OTP</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setClientErrors((prev) => ({ ...prev, otp: null }));
              }}
            />
            {clientErrors.otp && <p className="text-red-500 text-xs text-left">{clientErrors.otp}</p>}
          </div>
          {serverError && <p className="text-red-500">{serverError}</p>}
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
}
