import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import { useTop } from "../contexts/TopProvider";
import { Card } from '@tremor/react';
import { useUserInfo } from "../contexts/UserInfoProvider";
import { Callout } from '@tremor/react';
import PlusIcon from "../elements/icons/PlusIcon";
import TransactionCard from "../components/transaction/TransactionCard";
import NotificationCard from "../components/notification/NotificationCard";
import FriendCard from "../components/friend/FriendCard";

export default function HomePage(){

  const { 
    user, friendList, transactionList, notificationList, 
    refreshUser, refreshFriendList, refreshTransactionList, refreshNotificationList
  } = useUserInfo();
  const navigate = useNavigate();

  useEffect(()=>{
    refreshUser();
  }, [])
  useEffect(()=>{
    if(user == null) return;
    refreshFriendList();
    refreshTransactionList();
    refreshNotificationList();
  }, [user])

  const amount = useMemo(()=>user?.amount??0, [user]);

  const actions = useMemo(()=>({
    transactions: transactionList.filter(t=>t.acceptedAt==null),
    friends: friendList.filter(f=>f.status!="friend")
  }), [transactionList, friendList])

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto max-w-md pb-20 mt-4 px-4">
        <div className="flex flex-col gap-4">
          <Callout title="Renewal Info" color="teal">
            システムを一新して旧システムから切り離しました．<br/>
            安定しない場合は旧システム ( <a href="https://crowpayold.maruyu.work" target="_blank">https://crowpayold.maruyu.work</a> ) をご使用下さい．<br/>
            データベースは 2024/08/08 17:45 時点で Fork されています．
          </Callout>
          <Card
            className="mx-auto w-full shadow-lg"
            decoration="top"
            decorationColor="indigo"
          >
            <p className="text-tremor-default text-tremor-content">残高</p>
            <p className={`
              text-6xl text-tremor-content-strong font-semibold
              ${amount >= 0 ? "text-black" : "text-red-600"}
            `}>¥ {Intl.NumberFormat('en-US').format(amount)}</p>
          </Card>
            
          {
            (actions.friends.length > 0 || actions.transactions.length > 0) &&
            <Card className="mx-auto w-full shadow-lg">
              <p className="text-tremor-default text-tremor-content">アクション</p>
              { actions.friends.map(friend=>(
                  <FriendCard key={friend.friendUserId} friend={friend}/>
                ))
              }
              { actions.transactions.map(transaction=>(
                  <TransactionCard key={transaction.transactionId} transaction={transaction}/>
                ))
              }
            </Card>
          }
          
          <Card className="mx-auto w-full shadow-lg">
            <p className="text-tremor-default text-tremor-content">直近の3通知</p>
            <div className="flex flex-col gap-1">
              { notificationList.slice(0,3).map(notification=>(
                  <NotificationCard key={notification.notificationId} notification={notification}/>
                ))
              }
            </div>
          </Card>
          
          <Card className="mx-auto w-full shadow-lg">
            <p className="text-tremor-default text-tremor-content">直近の3取引</p>
            <div className="flex flex-col gap-1">
              { transactionList.filter(t=>t.acceptedAt!=null).slice(0,3).map(transaction=>(
                  <TransactionCard key={transaction.transactionId} transaction={transaction}/>
                ))
              }
            </div>
          </Card>
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