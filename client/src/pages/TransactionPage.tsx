import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import { useUserInfo } from "../contexts/UserInfoProvider";
import PlusIcon from "../elements/icons/PlusIcon";
import TransactionCard from "../components/transaction/TransactionCard";
import { TransactionClientType } from "../../../mtypes/TransactionType";
import { Button, Icon } from "@tremor/react";
import { sum } from "maruyu-webcommons/commons/utils/number";
import FriendHorizontalList from "../components/friend/FriendHorizontalList";
import { FriendClientType } from "../../../mtypes/FriendType";
import { RiArrowDownLine, RiArrowUpLine } from "@remixicon/react";

export default function TransactionPage(){

  const navigate = useNavigate();
  const { user, transactionList, refreshTransactionList, friendList } = useUserInfo();
  useEffect(()=>{ 
    if(user == null) return;
    refreshTransactionList() 
  }, [user]);

  // const [ selectingFriendUserIdList, setSelectingFriendUserIdList ] = useTypeStateCookie<string[]>(
  //   "tsuid", [], v=>v.join(","), v=>v.split(",").filter(w=>w!="undefined"&&w.length>0)
  // );
  // const [ isInitialized, setIsInitialized ] = useState<boolean>(false); 
  const [ selectingFriendList, setSelectingFriendList ] = useState<FriendClientType[]>([]);
  // useEffect(()=>{
  //   if(friendList.length == 0) return;
  //   if(ArrayUtil.isSameElms(selectingFriendList.map(f=>f.friendUserId),selectingFriendUserIdList)) return;
  //   setSelectingFriendList(friendList.filter(f=>selectingFriendUserIdList.includes(f.friendUserId)));
  //   if(!isInitialized) setIsInitialized(true);
  // }, [selectingFriendUserIdList, friendList])
  // useEffect(()=>{
  //   if(friendList.length == 0) return;
  //   if(!isInitialized) return;
  //   if(ArrayUtil.isSameElms(selectingFriendList.map(f=>f.friendUserId),selectingFriendUserIdList)) return;
  //   setSelectingFriendUserIdList(selectingFriendList.map(f=>f.friendUserId));
  // }, [selectingFriendList, friendList])

  const [ showingTransactionList, setShowingTransactionList ] = useState<TransactionClientType[]>([]);
  const [ sortKey, setSortKey ] = useState<"issue"|"accept">("accept");
  const [ descending, setDescending ] = useState<boolean>(true);

  useEffect(()=>{
    setShowingTransactionList(
      (
        selectingFriendList.length == 0 
        ? [...transactionList]
        : transactionList.filter(t=>{
          if(selectingFriendList.find(f=>f.friendUserId==t.senderUserId)) return true;
          if(selectingFriendList.find(f=>f.friendUserId==t.receiverUserId)) return true;
          return false;
        })
      ).sort((a,b)=>{
        if(sortKey == "issue"){
          return (a.issuedAt.getTime()-b.issuedAt.getTime()) * (descending?-1:1);
        }
        if(sortKey == "accept"){
          if(a.acceptedAt && b.acceptedAt){
            return (a.acceptedAt.getTime() - b.acceptedAt.getTime()) * (descending?-1:1);
          }
          if(a.acceptedAt && b.acceptedAt == null) return -1 * (descending?-1:1);
          if(a.acceptedAt == null && b.acceptedAt) return 1 * (descending?-1:1);
          return (a.issuedAt.getTime() - b.issuedAt.getTime()) * (descending?-1:1);
        }
        return 0;
      })
    )
  }, [selectingFriendList, transactionList, sortKey, descending]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto max-w-md pb-20 mt-4 px-4">
        <h1 className="text-2xl">Transactions</h1>
        <h2 className="text-lg">フィルターする相手を選択</h2>
        <FriendHorizontalList 
          showingSortKeys={["lastDealedAt","alphabet","amount"]}
          friendList={friendList.filter(friend=>friend.status=="friend")}
          selectingFriendList={selectingFriendList}
          setSelectingFriendList={setSelectingFriendList}
        />
        <p className="font-bold my-1">
          {selectingFriendList.map(f=>f.friendUserName).join(" / ")}
        </p>

        <div className="flex flex-col gap-2 mt-2">
          {showingTransactionList.filter(t=>t.acceptedAt==null).map(transaction=>(
            <TransactionCard key={transaction.transactionId} transaction={transaction}/>
          ))}
        </div>
        <div className="my-2 flex items-center">
          <p className="font-semibold">合計取引収支 ¥{' '}
            {(()=>{
              const s = sum(showingTransactionList.map(t=>
                t.acceptedAt==null ? 0 : t.receiverUserId==user?.userId ? t.amount : -t.amount
              ));
              return <span className={s<0?"text-red-500":""}>{Intl.NumberFormat('en-US').format(s)}</span>
            })()}
          </p>
          <div className="ms-auto flex gap-2 justify-end">
            <Button size="xs" 
              className="py-0 h-8"
              variant={sortKey=="issue"?"primary":"secondary"}
              onClick={()=>{
                if(sortKey=="issue") setDescending(!descending)
                else { setSortKey("issue"); setDescending(true); }
              }}
            >起票
            { sortKey=="issue" &&
              <Icon 
                size="sm" 
                className="ms-auto text-white py-0 pe-0 ps-0" 
                icon={descending?RiArrowDownLine:RiArrowUpLine}
              />
            }
            </Button>
            <Button size="xs" 
              className="py-0 h-8"
              variant={sortKey=="accept"?"primary":"secondary"}
              onClick={()=>{
                if(sortKey=="accept") setDescending(!descending)
                else { setSortKey("accept"); setDescending(true); }
              }}
            >承認
            { sortKey=="accept" &&
              <Icon 
                size="sm" 
                className="ms-auto text-white py-0 pe-0 ps-0" 
                icon={descending?RiArrowDownLine:RiArrowUpLine}
              />
            }
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2 my-2">
          {showingTransactionList.filter(t=>t.acceptedAt!=null).map(transaction=>(
            <TransactionCard key={transaction.transactionId} transaction={transaction}/>
          ))}
        </div>
      </div>
      <div className="fixed bottom-4 end-4">
        <button 
          type="button" 
          className="
            text-white bg-blue-700 hover:bg-blue-800 
            focus:ring-4 focus:outline-none focus:ring-blue-300 
            font-medium rounded-full text-sm p-2.5 text-center 
            inline-flex items-center
            w-16 h-16
          "
          onClick={e=>navigate('/issue')}
        ><PlusIcon/></button>
      </div>
    </div>
  );
}