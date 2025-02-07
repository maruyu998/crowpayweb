import { useState } from "react";
import { useTop } from "../../contexts/TopProvider";
import { changePassword } from "../../data/auth";
import PasswordStrengthBar from 'react-password-strength-bar';

export default function ChangePassword({

}:{

}){
  const { addAlert } = useTop();

  const [ currentPassword, setCurrentPassword ] = useState<string>("");
  const [ newPassword, setNewPassword ] = useState<string>("");
  const [ confirmPassword, setConfirmPassword ] = useState<string>("");

  
  function submitHandler(e){
    e.preventDefault();
    if(currentPassword.length == 0) return addAlert("SubmitError", "Current Password is empty");
    if(newPassword.length == 0) return addAlert("SubmitError", "New Password is empty");
    if(confirmPassword.length == 0) return addAlert("SubmitError", "Confirm Password is empty");

    if(currentPassword == newPassword) return addAlert("SubmitError", "New Password is the same as old Password");
    if(newPassword != confirmPassword) return addAlert("SubmitError", "Confirm Password is not the same as New Password");

    changePassword({currentPassword, newPassword})
    .then(()=>{
      addAlert("ChangePasswordSuccess", "");
    })
    .catch(error=>{
      addAlert(`ChangePasswordError[${error.name}]`, error.message);
    })

  }

  return (
    <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={submitHandler}>
      <div>
        <label htmlFor="currentPassword" className="block mb-2 text-sm font-medium text-gray-900">Current Password</label>
        <input 
          type="password" 
          id="currentPassword" 
          className="
          bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
          "
          autoComplete="current-password"
          onChange={e=>setCurrentPassword(e.currentTarget.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900">New Password</label>
        <input 
          type="password" 
          id="newPassword" 
          className="
          bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
          "
          autoComplete="new-password"
          minLength={8}
          onChange={e=>setNewPassword(e.currentTarget.value)}
          required
        />
        <PasswordStrengthBar password={newPassword} minLength={8}/>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">Confirm password</label>
        <input 
          type="password" 
          id="confirmPassword"
          className="
          bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
            focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
          "
          autoComplete="new-password"
          minLength={8}
          onChange={e=>setConfirmPassword(e.currentTarget.value)}
          required
        />
        {/* <TextInput placeholder="Type password here" type="password" /> */}
      </div>
      <button 
        type="submit"
        className="
          w-full text-white bg-blue-400 hover:bg-blue-700 
          focus:ring-4 focus:outline-none focus:ring-blue-300 
          font-medium rounded-lg text-sm px-5 py-2.5 text-center
        "
      >Change Password</button>
    </form>
  );
}