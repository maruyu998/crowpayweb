import { RiUserFill } from "@remixicon/react";
import { Icon } from "@tremor/react";
import { useRef, useState } from "react";
import { useTop } from "../../contexts/TopProvider";
import { requestFriend } from "../../data/friend";
import { useUserInfo } from "../../contexts/UserInfoProvider";

export default function FriendRequestBoard({

}:{

}){
  const { addAlert } = useTop();
  const { user, refreshFriendList } = useUserInfo();
  const [ friendUserName, setFriendUserName ] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  function requestHandler(){
    if(user == null) return addAlert("FriendRequestError", "user is null");
    if(friendUserName.length == 0) return addAlert("FriendRequestError", "friendUserName is empty");
    if(!window.confirm(`${friendUserName} さんへフレンド申請しますか?`)) return;
    requestFriend({ friendUserName })
    .then(()=>{
      refreshFriendList();
      if(inputRef.current) inputRef.current.value = "";
    })
    .catch(error=>{
      addAlert(`FriendRequestError[${error.name}]`, error.message);
    })
  }

  return (
    <>
      <div className="w-full">
        <div className="relative w-full">
          <input type="search"
            className="
              block py-2.5 px-5 w-full text-sm text-gray-900 bg-white
              rounded-full border border-gray-300
              focus:ring-blue-500 focus:border-blue-500
            "
            placeholder="フレンド申請するユーザー名" 
            onChange={e=>setFriendUserName(e.currentTarget.value)}
            ref={inputRef}
            required
          />
          <button 
            type="button"
            className=" 
              absolute top-0 end-0 h-full ps-3 pe-4 
              text-sm font-medium bg-blue-700 
              rounded-e-full border border-blue-700 hover:bg-blue-800 
              focus:ring-4 focus:outline-none focus:ring-blue-300
            "
          >            
            <Icon 
              size="sm" 
              className="ms-auto text-white" 
              icon={RiUserFill} 
              onClick={requestHandler}
            />
          </button>
        </div>
      </div>
    </>
  )
}