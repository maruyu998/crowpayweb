import React, { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import { useUserInfo } from "../contexts/UserInfoProvider";
import FriendCard from "../components/friend/FriendCard";
import { FriendClientType } from "../../../mtypes/FriendType";
import { Button, Divider } from "@tremor/react";
import { Icon } from '@tremor/react';
import { RiSortAsc, RiSortDesc } from "@remixicon/react";
import InvitationBoard from "../components/friend/InvitationBoard";
import FriendRequestBoard from "../components/friend/FriendRequestBoard";

export default function FriendPage(){

  const { user, friendList, refreshFriendList } = useUserInfo();
  useEffect(()=>{ 
    if(user == null) return;
    refreshFriendList();
  }, [user]);

  const [ sortKey, setSortKey ] = useState<"lastDealedAt"|"amount">("lastDealedAt");
  const [ descending, setDescending ] = useState<boolean>(true);
  const [ showingFriendList, setShowingFriendList ] = useState<FriendClientType[]>([]);
  useEffect(()=>{
    setShowingFriendList([...friendList.filter(f=>f.status=="friend").sort((a,b)=>{
      if(sortKey == "lastDealedAt"){
        return ((a.lastDealedAt?.getTime()??0) - (b.lastDealedAt?.getTime()??0)) * (descending ? -1 : 1);
      }
      if(sortKey == "amount"){
        return ((a.amount??0) - (b.amount??0)) * (descending ? -1 : 1);
      }
      return 0;
    })])
  }, [friendList, sortKey, descending])

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto max-w-md pb-20 mt-4 px-4">
        <h1 className="text-2xl">Friends</h1>
        <div className="flex flex-col gap-2 my-2">
          <h1 className="mt-2 font-semibold text-md">アクション</h1>
          <InvitationBoard />
          <Divider className="my-1 px-2"/>
          <FriendRequestBoard />
          
          {friendList.filter(f=>f.status!="friend").map(friend=>(
            <FriendCard key={friend.friendUserId} friend={friend} />
          ))}

          <h1 className="mt-2 font-semibold text-md">一覧</h1>
          <div className="flex gap-2">
            <Button size="xs" 
              variant={sortKey=="lastDealedAt"?"primary":"secondary"}
              onClick={()=>setSortKey("lastDealedAt")}
            >最終取引</Button>
            <Button size="xs" 
              variant={sortKey=="amount"?"primary":"secondary"}
              onClick={()=>setSortKey("amount")}
            >残高</Button>
            <Icon size="sm" className="ms-auto cursor-pointer" 
              icon={descending ? RiSortDesc : RiSortAsc } 
              onClick={()=>setDescending(!descending)}
            />
          </div>
          {showingFriendList.map(friend=>(
            <FriendCard key={friend.friendUserId} friend={friend} />
          ))}
        </div>
      </div>
    </div>
  );
}