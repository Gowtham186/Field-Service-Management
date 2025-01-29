import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { expertRegister, getUserProfile } from "../redux/slices.js/user-slice";
import validator from 'validator';
import { useNavigate } from "react-router-dom";

const formInitialState = {
  name: '',
  phone_number: '',
  email: '',
  password: '',
  role: 'expert'
};

export default function ExpertRegister() {
  const [formData, setFormData] = useState(formInitialState);
  const [clientErrors, setClientErrors] = useState({});
  const errors = {};
  const dispatch = useDispatch();
  const { serverError } = useSelector((state) => state.user);
  const navigate = useNavigate();


  /* useEffect(()=>{
    localStorage.setItem('expertRegister', JSON.stringify(formData))
  },[formData]) */

  const runClientValidations = () => {
    if (!formData.name) {
      errors.name = 'Name is required';
    } else if (!validator.isAlpha(formData.name)) {
      errors.name = 'Name should not contain numbers or special characters';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validator.isEmail(formData.email)) {
      errors.email = 'Email should be in valid format';
    }

    if (!formData.phone_number) {
      errors.phone_number = 'Phone number is required';
    } else if (!validator.isNumeric(formData.phone_number)) {
      errors.phone_number = 'Phone number should contain only numeric digits';
    } else if (!/^[9876]\d{9}$/.test(formData.phone_number)) {
      errors.phone_number = 'Phone number should start with 9, 8, 7, or 6 and be 10 digits long';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!validator.isStrongPassword(formData.password)) {
      errors.password = 'Password must contain at least 8 characters, 1 uppercase letter, and 1 special character';
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    runClientValidations();
    const resetForm = () => setFormData(formInitialState);
    if (Object.keys(errors).length !== 0) {
      setClientErrors(errors);
    } else {
      try {
        setClientErrors({});
        await dispatch(expertRegister({ formData, resetForm })).unwrap();
        await dispatch(getUserProfile()).unwrap()
        navigate('/create-expert');
      } catch (err) {
        console.log('Error registering expert', err);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 p-6 ml-9">
        <h1 className="text-3xl font-semibold mb-4">Expert Register</h1>
        <form onSubmit={handleRegister}>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setClientErrors({ ...clientErrors, name: null });
            }}
            className="mt-1 block w-1/2 p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {clientErrors && <p className="text-red-500 text-xs text-left">{clientErrors.name}</p>}
          {serverError &&
           (typeof serverError === "string" ? (
            serverError.includes("name") && (
            <p className="text-red-500 text-xs text-left">{serverError}</p>
            )
            ) : ( Array.isArray(serverError) &&
                serverError.filter(err => err.path === "name").map((err, index) => (
                    <p key={index} className="text-red-500 text-xs text-left">{err.msg}</p>
                )
            )))
            }

          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1 mt-3">Phone Number:</label>
          <input
            type="text"
            id="phone_number"
            value={formData.phone_number}
            onChange={(e) => {
              setFormData({ ...formData, phone_number: e.target.value });
              setClientErrors({ ...clientErrors, phone_number: null });
            }}
            className="mt-1 block w-1/2 p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {clientErrors && <p className="text-red-500 text-xs text-left ">{clientErrors.phone_number}</p>}
          {serverError &&
           (typeof serverError === "string" ? (
            serverError.includes("phone_number") && (
            <p className="text-red-500 text-xs text-left">{serverError}</p>
            )
            ) : ( Array.isArray(serverError) &&
                serverError.filter(err => err.path === "phone_number").map((err, index) => (
                    <p key={index} className="text-red-500 text-xs text-left">{err.msg}</p>
                )
            )))
            }

          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-3 mb-1">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setClientErrors({ ...clientErrors, email: null });
            }}
            className="mt-1 block w-1/2 p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {clientErrors && <p className="text-red-500 text-xs text-left">{clientErrors.email}</p>}
          {serverError &&
           (typeof serverError === "string" ? (
            serverError.includes("email") && (
            <p className="text-red-500 text-xs text-left ">{serverError}</p>
            )
            ) : ( Array.isArray(serverError) &&
                serverError.filter(err => err.path === "email").map((err, index) => (
                    <p key={index} className="text-red-500 text-xs text-left ">{err.msg}</p>
                )
            )))
            }

          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-3 mb-1">Password:</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setClientErrors({ ...clientErrors, password: null });
            }}
            className="mt-1 block w-1/2 p-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {clientErrors && <p className="text-red-500 text-xs text-left ">{clientErrors.password}</p>}


          <button
            type="submit"
            className="mt-4 py-2 px-4 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>

      <div className="w-1/2 bg-gray-200 flex items-center justify-center">
        <img
          src="your-image-url-here.jpg"
          alt="Expert Register"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
