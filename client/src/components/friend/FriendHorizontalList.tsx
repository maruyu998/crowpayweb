import { Button, Card, Icon } from "@tremor/react";
import { FriendClientType } from "../../../../mtypes/FriendType";
import { useEffect, useMemo, useState } from "react";
import { RiArrowDownLine, RiArrowUpLine, RiFilter3Fill, RiFilterFill, RiSortAsc } from "@remixicon/react";

export const SortKeys = ["lastDealedAt","amount","alphabet"] as const;
type SortKeyType = typeof SortKeys[number];

export default function FriendHorizontalList({
  showingSortKeys,
  friendList,
  selectingFriendList,
  setSelectingFriendList,
}:{
  showingSortKeys: SortKeyType[],
  friendList: FriendClientType[],
  selectingFriendList: (FriendClientType&{dealAmount?:number})[]
  setSelectingFriendList: (value:React.SetStateAction<(FriendClientType&{dealAmount?:number})[]>)=>void
}){

  const [ sortKey, setSortKey ] = useState<SortKeyType>(showingSortKeys[0]??"lastDealedAt");
  const [ descending, setDescending ] = useState<boolean>(showingSortKeys[0]=="lastDealedAt"?true:false);
  const [ filterKey, setFilterKey ] = useState<string>("");
  const [ showingFriendList, setShowingFriendList ] = useState<FriendClientType[]>([]);
  useEffect(()=>{
    setShowingFriendList(friendList
      .filter(f=>{
        if(filterKey.length == 0) return true;
        return f.friendUserName.toLowerCase().includes(filterKey.toLowerCase())
      })
      .sort((a,b)=>{
        if(sortKey == "lastDealedAt"){
          return ((a.lastDealedAt?.getTime()??0) - (b.lastDealedAt?.getTime()??0)) * (descending?-1:1);
        }
        if(sortKey == "amount"){
          return ((a.amount??0) - (b.amount??0)) * (descending?-1:1);
        }
        if(sortKey == "alphabet"){
          return (a.friendUserName < b.friendUserName ? 1 : -1) * (descending?-1:1);
        }
        return 0;
      })
    )
  }, [sortKey, friendList, descending, filterKey])
  
  const selectingFriendUserIdList = useMemo(()=>{
    return selectingFriendList.map(f=>f.friendUserId)
  }, [selectingFriendList])

  function toggleSelectedFriend(friend:FriendClientType){
    setSelectingFriendList(
      selectingFriendUserIdList.includes(friend.friendUserId) 
      ? selectingFriendList.filter(f=>f.friendUserId!=friend.friendUserId)
      : [...selectingFriendList, {...friend, dealAmount:0}]
    );
  }

  return (
    <div className="w-full">
      <div className="flex gap-1">
        <div className="w-full relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-0.5 pointer-events-none">
            <Icon size="sm" className="ms-auto" icon={RiFilter3Fill} />
          </div>
          <input 
            type="search"
            className="
              block w-full p-[0.3rem] ps-10 text-sm text-gray-900 
              border border-gray-300 rounded-lg bg-white 
              focus:ring-blue-500 focus:border-blue-500
            " 
            placeholder="Filter Friend"
            onChange={e=>setFilterKey(e.currentTarget.value.trim())}
          />
        </div>
        {
          showingSortKeys.map(sk=>{
            if(sk == "lastDealedAt"){
              return (
                <Button size="xs" key={sk}
                  className="py-0 h-8"
                  variant={sortKey=="lastDealedAt"?"primary":"secondary"}
                  onClick={()=>{
                    if(sortKey=="lastDealedAt") setDescending(!descending)
                    else { setSortKey("lastDealedAt"); setDescending(true); }
                  }}
                >最終取引
                { sortKey=="lastDealedAt" &&
                  <Icon 
                    size="sm" 
                    className="ms-auto text-white py-0 pe-0 ps-0" 
                    icon={descending?RiArrowDownLine:RiArrowUpLine}
                  />
                }
                </Button>
              );
            }
            if(sk == "amount"){
              return (
                <Button size="xs" key={sk}
                  className="py-0 h-8"
                  variant={sortKey=="amount"?"primary":"secondary"}
                  onClick={()=>{
                    if(sortKey=="amount") setDescending(!descending)
                    else { setSortKey("amount"); setDescending(false); }
                  }}
                >残高
                { sortKey=="amount" &&
                  <Icon 
                    size="sm" 
                    className="ms-auto text-white py-0 pe-0 ps-0" 
                    icon={descending?RiArrowDownLine:RiArrowUpLine}
                  />
                }
                </Button>
              )
            }
            if(sk == "alphabet"){
              return (
                <Button size="xs" key={sk}
                  className="py-0 h-8"
                  variant={sortKey=="alphabet"?"primary":"secondary"}
                  onClick={()=>{
                    if(sortKey=="alphabet") setDescending(!descending)
                    else { setSortKey("alphabet"); setDescending(true); }
                  }}
                >名前
                {
                  sortKey=="alphabet" &&
                  <Icon 
                    size="sm" 
                    className="ms-auto text-white py-0 pe-0 ps-0" 
                    icon={descending?RiArrowDownLine:RiArrowUpLine}
                  />
                }
                </Button>
              )
            }
            return <></>;
          })
        }
      </div>
      <div className="flex gap-2 px-0.5 py-2 w-full overflow-x-auto">
        {showingFriendList.map(friend=>(
          <Card 
            key={friend.friendUserId} 
            className={`
              shadow-lg border-4 p-2 min-w-fit cursor-pointer
              ${selectingFriendUserIdList.includes(friend.friendUserId)
                ? "bg-slate-300 border-blue-400" 
                : "bg-white border-white"
              }
            `}
            onClick={e=>toggleSelectedFriend(friend)}
          >
            <p className="font-bold text-sm">{friend.friendUserName}</p>
            {
              friend.amount != null &&
              <p className="font-bold text-xs">残高{' '}
                <span className={friend.amount < 0 ? "text-red-500" : ""}>
                  ¥{Intl.NumberFormat('en-US').format(friend.amount)}
                </span>
              </p>
            }
          </Card>
        ))}
      </div>
    </div>
  );
}