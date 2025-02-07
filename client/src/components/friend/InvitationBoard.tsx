import { useEffect, useState } from "react";
import { issueInvitation, removeInvitation } from "../../data/invitation";
import { useTop } from "../../contexts/TopProvider";
import { MdateTz } from "maruyu-webcommons/commons/utils/mdate";
import { useUserInfo } from "../../contexts/UserInfoProvider";

export default function InvitationBoard({

}:{

}){

  const { addAlert } = useTop();
  const { user, invitationList, refreshInvitationList } = useUserInfo();
  
  useEffect(()=>{ 
    if(user == null) return;
    refreshInvitationList();
  }, [user]);

  function issueInvitationHandler(){
    if(user == null) return addAlert("IssueInvitationError", "user is null");
    issueInvitation()
    .then(()=>{
      refreshInvitationList();
    })
    .catch(error=>{
      addAlert(`IssueError[${error.name}]`, error.message);
    })
  }
  function removeHandler(invitationId:string){
    if(user == null) return addAlert("RemoveInvitationError", "user is null");
    removeInvitation({ invitationId })
    .then(()=>{
      refreshInvitationList();
    })
    .catch(error=>{
      addAlert(`RemoveError[${error.name}]`, error.message);
    })
  }

  return (
    <>
      <button 
        type="button" 
        className="
          py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none 
          bg-white rounded-full border border-gray-200 
          hover:bg-gray-100 hover:text-blue-700 
        "
        onClick={issueInvitationHandler}
      >招待コードを発行</button>
      {
        invitationList.map(({invitationId, invitationCode, expiredAt})=>(
          <div className={`p-4 bg-white border rounded-lg shadow-lg border-gray-200`} key={invitationId}>
            <div className="card-body">
              <div className="m-0">
                <p className="font-bold">{invitationCode}</p>
                <p className="text-sm font-base">有効期限 {new MdateTz(expiredAt.getTime(),"Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss")}</p>
              </div>
              <button 
                type="button" 
                className="
                  text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300
                  font-medium rounded-full text-sm px-2.5 py-1 text-center
                "
                onClick={()=>removeHandler(invitationId)}
              >Remove</button>
            </div>
          </div>
        ))
      }
    </>
  )
}