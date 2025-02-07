import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { TransactionClientType, TransactionType } from '../../../mtypes/TransactionType';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { FriendClientType } from '../../../mtypes/FriendType';
import { NotificationType } from '../../../mtypes/NotificationType';
import { getNotificationList } from '../data/notification';
import { useTop } from './TopProvider';
import { getTransactionList } from '../data/transaction';
import { UserClientType } from '../../../mtypes/UserType';
import { getUser } from '../data/user';
import { getFriendList } from '../data/friend';
import { WalletType } from '../../../mtypes/WalletType';
import { getWalletList } from '../data/wallet';
import { InvitationType } from '../../../mtypes/InvitationType';
import { getInvitationList } from '../data/invitation';

type UserInfoProviderType = {
  user: UserClientType|null,
  friendList: FriendClientType[],
  transactionList: TransactionClientType[],
  notificationList: NotificationType[],
  walletList: WalletType[],
  invitationList: InvitationType[],

  refreshUser: ()=>Promise<void>,
  refreshFriendList: ()=>Promise<void>,
  refreshTransactionList: ()=>Promise<void>,
  refreshNotificationList: ()=>Promise<void>,
  refreshInvitationList: ()=>Promise<void>,

  convertWalletIdToName: (...walletIdList:string[])=>(string|undefined)[]
}

const UserInfoContext = createContext<UserInfoProviderType|undefined>(undefined);

export function useUserInfo(){
  const context = useContext(UserInfoContext);
  if(context === undefined) throw new Error("context must be used within a provider");
  return context;
}

export function UserInfoProvider({children}){

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { addAlert } = useTop();

  const [ user, setUser ] = useState<UserClientType|null>(null);
  const [ friendList, setFriendList ] = useState<FriendClientType[]>([]);
  const [ transactionList, setTransactionList ] = useState<TransactionClientType[]>([]);
  const [ notificationList, setNotificationList ] = useState<NotificationType[]>([]);
  const [ walletList, setWalletList ] = useState<WalletType[]>([]);
  const [ invitationList, setInvitationList ] = useState<InvitationType[]>([]);

  function convertWalletIdToName(...walletIdList:string[]){
    return walletIdList.map(walletId=>walletList.find(w=>w.walletId==walletId)?.walletName)
  }

  async function refreshUser(){
    return getUser().then(user=>{setUser(user)})
  }
  async function refreshFriendList(){
    await getFriendList()
          .then(friendList=>setFriendList(friendList))
          .catch(error=>{
            addAlert(`RefreshFriendListError [${error.name}]`, error.message);
          })
  }
  async function refreshTransactionList(){
    await getTransactionList()
          .then(transactionList=>setTransactionList(transactionList))
          .catch(error=>{
            addAlert(`RefreshTransactionListError [${error.name}]`, error.message);
          })
  }
  async function refreshNotificationList(){
    await getNotificationList()
          .then(notificationList=>setNotificationList(notificationList))
          .catch(error=>{
            addAlert(`RefreshNotificationListError [${error.name}]`, error.message);
          })
  }
  async function refreshWalletList(){
    await getWalletList()
          .then(walletList=>setWalletList(walletList))
          .catch(error=>{
            addAlert(`RefreshWalletListError [${error.name}]`, error.message);
          })
  }
  async function refreshInvitationList(){
    await getInvitationList()
          .then(invitationList=>setInvitationList(invitationList))
          .catch(error=>{
            addAlert(`RefreshInvitationListError[${error.name}]`, error.message);
          })
  }


  useEffect(()=>{
    const returnTo = searchParams.get("returnTo");
    refreshUser()
    .then(()=>{
      refreshFriendList();
      refreshTransactionList();
      refreshNotificationList();
      refreshWalletList();
      refreshInvitationList();
      if(location.pathname == "/signin" || location.pathname == "/signup") {
        return navigate(returnTo ?? "/");
      }
    })
    .catch(error=>{
      if(error.name == "AuthenticationError"){
        if(location.pathname != "/signin" && location.pathname != "/signup") {
          return navigate(`/signin?returnTo=${location.pathname}`);
        }
      }
      throw error;
    })
  }, [])


  return (
    <UserInfoContext.Provider
      value={{
        user,
        friendList,
        transactionList,
        notificationList,
        walletList,
        invitationList,

        refreshUser,
        refreshFriendList,
        refreshTransactionList,
        refreshNotificationList,
        refreshInvitationList,

        convertWalletIdToName,
      }}
    >{children}</UserInfoContext.Provider>
  )
}
