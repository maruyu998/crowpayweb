import { MdateTz } from "maruyu-webcommons/commons/utils/mdate";
import { TransactionClientType } from "../../../../mtypes/TransactionType";
import { useTop } from "../../contexts/TopProvider";
import { useUserInfo } from "../../contexts/UserInfoProvider";
import { acceptTransaction, cancelTransaction, declineTransaction } from "../../data/transaction";

export default function TransactionCard({
  transaction
}:{
  transaction: TransactionClientType
}){
  const { addAlert } = useTop();
  const { user, refreshTransactionList, refreshUser } = useUserInfo();

  function acceptHandler(){
    if(user == null) return addAlert("AcceptError", "user is null");
    if(!window.confirm(`取引を受け入れますか?`)) return;
    acceptTransaction({ transactionId: transaction.transactionId })
    .then(transaction=>{
      refreshUser();
      refreshTransactionList();
    })
    .catch(error=>{
      addAlert(`AcceptError [${error.name}]`, error.message);
    })
  }
  function declineHandler(){
    if(user == null) return addAlert("DeclineError", "user is null");
    if(!window.confirm(`取引を拒否しますか?`)) return;
    declineTransaction({ transactionId: transaction.transactionId })
    .then(()=>{
      refreshUser();
      refreshTransactionList();
    })
    .catch(error=>{
      addAlert(`DeclineError [${error.name}]`, error.message);
    })
  }
  function cancelHandler(){
    if(user == null) return addAlert("CancelError", "user is null");
    if(!window.confirm(`取引をキャンセルしますか?`)) return
    cancelTransaction({ transactionId: transaction.transactionId })
    .then(()=>{
      refreshUser();
      refreshTransactionList();
    })
    .catch(error=>{
      addAlert(`CancelError [${error.name}]`, error.message);
    })
  }

  return (
    <div 
      className={`
        p-4 bg-white border rounded-lg shadow-lg border-gray-200 border-s-8
        ${transaction.receiverUserId == user?.userId ? " border-blue-300 " : ""}
        ${transaction.senderUserId == user?.userId ? " border-red-300 " : ""}
      `}
    >
      <div className="card-body">
        <p className="m-0 text-base font-base flex gap-2">{transaction.content}</p>
        <p className="m-0 flex gap-2">
          <span className="text-base">{transaction.senderUserName} ➡ {transaction.receiverUserName}</span>
          <span className={`text-sm my-auto font-semibold ${transaction.amount < 0 ? "text-red-400" : ""}`}>
            (¥{Intl.NumberFormat('en-US').format(transaction.amount)})
          </span>
        </p>
        <div className="mt-1">
          <p className="m-0 text-xs">
            起票 <span className="font-semibold">{new MdateTz(transaction.issuedAt.getTime(),"Asia/Tokyo").format("YYYY/MM/DD(dd) HH:mm","ja")}</span>
          </p>
          {
            transaction.acceptedAt &&
            <p className="m-0 text-xs">
              承認 <span className="font-semibold">{new MdateTz(transaction.acceptedAt.getTime(),"Asia/Tokyo").format("YYYY/MM/DD(dd) HH:mm","ja")}</span>
            </p>
          }
        </div>
        {
          transaction.acceptedAt == null && 
          <div className="flex gap-6 mt-1">
            {
              transaction.accepterUserId == user?.userId &&
              <button 
                type="button" 
                className="
                  text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 
                  font-medium rounded-full text-sm px-2.5 py-1 text-center
                "
                onClick={acceptHandler}
              >Accept</button>
            }
            {
              transaction.accepterUserId == user?.userId &&
              <button 
                type="button" 
                className="
                  text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300
                  font-medium rounded-full text-sm px-2.5 py-1 text-center
                "
                onClick={declineHandler}
              >Decline</button>
            }
            {
              transaction.issuerUserId == user?.userId &&
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
        }
      </div>
    </div>
  )
}