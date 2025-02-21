import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordWithOldPassword, resetState } from "../redux/slices.js/password-slice";
import { toast } from "react-toastify";
import validator from 'validator';

export default function ResetPassword() {
  const dispatch = useDispatch();
  const { isLoading, success, error } = useSelector((state) => state.password);
  const { user } = useSelector((state) => state.user);

  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [clientErrors, setClientErrors] = useState({});

  // Success & Error handling
  useEffect(() => {
    if (success) {
      toast.success("Password updated successfully!");
      dispatch(resetState()); // Reset success state
      setOldPassword("");
      setNewPassword("");
    }
    if (error) {
      toast.error(error);
      dispatch(resetState()); // Reset error state
    }
  }, [success, error, dispatch]);

  const runClientValidations = () => {
    const errors = {};
    if (!oldPassword) {
      errors.oldPassword = "Old password is required";
    } else if (!validator.isStrongPassword(oldPassword)) {
      errors.oldPassword = "Must have at least 8 characters, 1 uppercase, and 1 special character";
    }

    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (!validator.isStrongPassword(newPassword)) {
      errors.newPassword = "Must have at least 8 characters, 1 uppercase, and 1 special character";
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!runClientValidations()) return; // Stop if validation fails

    dispatch(resetPasswordWithOldPassword({ email, oldPassword, newPassword }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white text-gray-800 rounded-lg shadow-lg border">
      <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Old Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          {clientErrors.oldPassword && <p className="text-red-500 text-xs">{clientErrors.oldPassword}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-700">New Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {clientErrors.newPassword && <p className="text-red-500 text-xs">{clientErrors.newPassword}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
        >
        {isLoading ? (
        <>
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25"cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z"></path>
            </svg>
            Booking...
            </>
        ) : (
            "Confirm Booking"
        )}        
        </button>
      </form>
    </div>
  );
}
