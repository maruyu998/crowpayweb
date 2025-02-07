import { MdateTz } from "maruyu-webcommons/commons/utils/mdate";
import { FriendClientType } from "../../../../mtypes/FriendType";
import { useTop } from "../../contexts/TopProvider";
import { useUserInfo } from "../../contexts/UserInfoProvider";
import { acceptFriend, cancelFriend, declineFriend } from "../../data/friend";

export default function FriendCard({
  friend
}:{
  friend: FriendClientType
}){
  const { addAlert } = useTop();
  const { user, refreshFriendList, convertWalletIdToName } = useUserInfo();

  function acceptHandler(){
    if(user == null) return addAlert("AcceptError", "user is null");
    if(!window.confirm(`${friend.friendUserName}さんからのフレンド申請を受け入れますか?`)) return;
    acceptFriend({ friendUserId:friend.friendUserId })
    .then(()=>{
      refreshFriendList()
    })
    .catch(error=>{
      addAlert(`AcceptError [${error.name}]`, error.message);
    })
  }
  function declineHandler(){
    if(user == null) return addAlert("DeclineError", "user is null");
    if(!window.confirm(`${friend.friendUserName}さんからのフレンド申請を却下しますか?`)) return;
    declineFriend({ friendUserId:friend.friendUserId })
    .then(()=>{
      refreshFriendList()
    })
    .catch(error=>{
      addAlert(`DeclineError [${error.name}]`, error.message);
    })
  }
  function cancelHandler(){
    if(user == null) return addAlert("CancelError", "user is null");
    if(!window.confirm(`${friend.friendUserName}さんへのフレンド申請をキャンセルしますか?`)) return;
    cancelFriend({ friendUserId:friend.friendUserId })
    .then(()=>{
      refreshFriendList()
    })
    .catch(error=>{
      addAlert(`CancelError [${error.name}]`, error.message);
    })
  }

  return (
    <div className={`p-4 bg-white border rounded-lg shadow-lg border-gray-200`}>
      <div className="card-body">
        <div className="m-0">
          <p className="font-bold">{friend.friendUserName}</p>
          { friend.amount != null && 
            <p className="text-sm font-base">残高{` `}
              <span className={`${friend.amount < 0 ? "text-red-600" : ""}`}>
                ¥{Intl.NumberFormat('en-US').format(friend.amount)}
              </span>
            </p>
          }
          { friend.lastDealedAt != null && 
            <p className="text-xs font-semibold">最終取引 {new MdateTz(friend.lastDealedAt.getTime(),"Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss")}</p>
          }
          { friend.walletIdList != null && friend.walletIdList.length > 0 && 
            <p className="text-xs font-normal">Wallet {convertWalletIdToName(...friend.walletIdList).join(" / ")}</p>
          }
        </div>
        {
          friend.status != "friend" && 
          <>
            <p className="text-xs mb-2">このユーザーの招待者:{' '}
              <span className="font-bold">{friend.inviterUserName??"不明(登録されていないか，あなたの友人とのつながりがありません)"}</span>
            </p>
            <div className="flex gap-6">
              {
                friend.status == "requested" && 
                <>
                  <button 
                    type="button" 
                    className="
                      text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 
                      font-medium rounded-full text-sm px-2.5 py-1 text-center
                    "
                    onClick={acceptHandler}
                  >Accept</button>
                  <button 
                    type="button" 
                    className="
                      text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300
                      font-medium rounded-full text-sm px-2.5 py-1 text-center
                    "
                    onClick={declineHandler}
                  >Decline</button>
                </>
              }
              {
                friend.status == "requesting" &&
                <button 
                  type="button" 
                  className="
                    text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300
                    font-medium rounded-full text-sm px-2.5 py-1 text-center
                  "
                  onClick={cancelHandler}
                >Cancel</button>
              }
            </div>
          </>
        }
      </div>
    </div>
  );
}