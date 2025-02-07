import React from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import { useTop } from "../contexts/TopProvider";
import { Card, Switch } from '@tremor/react';
import ChangePassword from "../components/settings/ChangePassword";
import { signout } from "../data/auth";
import SetAvailableWallet from "../components/settings/SetAvailableWallet";
import { useUserInfo } from "../contexts/UserInfoProvider";

export default function SettingPage(){

  const navigate = useNavigate();
  const { addAlert, isPushOn, setIsPushOn } = useTop();
  const { user } = useUserInfo();

  function signoutHandler(){
    if(!window.confirm("ログアウトしますか?")) return;
    signout()
    .then(()=>navigate("/signin"))
    .catch(error=>{
      addAlert(`SignoutError[${error.name}]`, error.message);
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto max-w-md pb-20 mt-4 px-4">
        <div className="flex flex-col gap-4">
          <Card>
            <h1>Account</h1>
            <p className="text-sm">UserName: <span className="font-bold">{user?.userName??""}</span></p>
            <div className="flex mt-2">
              <button 
                type="button"
                className="
                  text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 
                  focus:ring-4 focus:outline-none focus:ring-gray-300 
                  font-medium rounded-lg px-3 py-2 text-xs text-center
                "
                onClick={signoutHandler}
              >Sign out</button>
            </div>
          </Card>
          <Card>
            <h1>Notifications</h1>
            <Switch
              id="pushSwitch"
              name="pushSwitch"
              checked={isPushOn==true}
              onChange={setIsPushOn}
            />
            <label htmlFor="pushSwitch" className="text-tremor-default text-tremor-content">
              このデバイスのプッシュ通知
            </label>
          </Card>
          <Card>
            <h1>Set Available Wallet</h1>
            <SetAvailableWallet />
          </Card>
          <Card>
            <h1>Change Password</h1>
            <ChangePassword />
          </Card>
          {/* <Card>
            <h1>API Keys</h1>
            <ChangePassword />
          </Card> */}
        </div>
      </div>
    </div>
  );
}