import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LogoImage from "../elements/images/logo.png";
import { useTop } from "../contexts/TopProvider";
import { signin } from "../data/auth";
import { useUserInfo } from "../contexts/UserInfoProvider";

export default function SigninPage(){

  const { addAlert } = useTop();
  const { refreshUser } = useUserInfo();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [ userName, setUserName ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");

  function submitHandler(e){
    e.preventDefault();
    if(userName.length == 0) return addAlert("FormError", "UserNameを入力してください");
    if(password.length == 0) return addAlert("FormError", "Passwordを入力してください");
    signin({ userName, password })
    .then(()=>{
      refreshUser().then(()=>{navigate(searchParams.get("returnTo") ?? "/")})
    })
    .catch(error=>{
      addAlert("SigninError", error.message);
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="rounded-md shadow-lg bg-white my-5 px-5 py-12 mx-auto text-center w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 max-w-96">
        <form className="w-3/4 mx-auto" onSubmit={submitHandler}>
          <div className="text-center mb-4">
            <Link to="/"><img className="mb-4 mx-auto" src={LogoImage} alt="" width="72" height="72" /></Link>
            <h1 className="text-3xl font-normal mb-3">CrowPay</h1>
            <p>お金の貸し借りを一つのwalletで記録</p>
          </div>
          <div className="my-2">
            <input 
              type="text" 
              className="form-control block w-full border border-gray-300 rounded text-center px-3 py-2" 
              placeholder="Username" 
              onChange={e=>setUserName(e.currentTarget.value)}
              required 
              autoFocus
            />
          </div>
          <div className="my-2">
            <input 
              type="password" 
              className="form-control block w-full border border-gray-300 rounded text-center px-3 py-2" 
              placeholder="Password" 
              onChange={e=>setPassword(e.currentTarget.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 bg-blue-500 text-white rounded"
          >Sign in</button>
          <hr className="my-6" />
          <p className="mx-auto mb-2">or</p>
          <button
            className="w-full py-2 bg-white border border-gray-300 rounded"
            onClick={()=>navigate('/signup')}
          >Sign up with invitation code</button>
        </form>
      </div>
    </div>
  );
}