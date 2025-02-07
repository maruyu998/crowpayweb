import { checkIsPushSubscriptionRegistered, registerNotification, unregisterNotification } from 'maruyu-webcommons/react/push';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

type AlertMessageType = {
  title: string|null, 
  content: string|null, 
  deleteAt: Date
}

type TopProviderType = {
  addAlert: (title:string|null,content:string|null,duration?:number)=>void,
  alertMessages: AlertMessageType[],
  isPushOn: boolean|null,
  setIsPushOn: React.Dispatch<React.SetStateAction<boolean|null>>,
}

const TopContext = createContext<TopProviderType|undefined>(undefined);

export function useTop(){
  const context = useContext(TopContext);
  if(context === undefined) throw new Error("context must be used within a provider");
  return context;
}

export function TopProvider({children}){

  const [ alertMessages, setAlertMessages ] = useState<AlertMessageType[]>([]);
  const alertMessagesRef = useRef<AlertMessageType[]>([]);
  useEffect(()=>{
    alertMessagesRef.current = alertMessages;
  }, [alertMessages])
  useEffect(()=>{
    function delteMessages(){
      if(alertMessagesRef.current == null) return;
      if(alertMessagesRef.current.length == 0) return;
      setAlertMessages(alertMessagesRef.current.filter(({deleteAt})=>deleteAt.getTime() > Date.now()))
    }
    const intervalId = setInterval(delteMessages.bind(alertMessages), 100);
    return ()=>clearInterval(intervalId);
  }, [])
  function addAlert(title:string|null, content:string|null, duration:number=5000){
    const deleteAt = new Date(Date.now() + duration);
    setAlertMessages([...alertMessages, { title, content, deleteAt }])
  }

  const [ isPushOn, setIsPushOn ] = useState<boolean|null>(null);
  useEffect(()=>{
    checkIsPushSubscriptionRegistered().then(bool=>setIsPushOn(bool))
  }, [])
  useEffect(()=>{
    if(isPushOn == null) return;
    if(isPushOn) {
      registerNotification().then(success=>{
        if(!success) {
          setIsPushOn(false);
          addAlert("PushOnFaild", "プッシュ通知をオンにできませんでした");
        }
      });
    }
    else {
      unregisterNotification().then(success=>{
        if(!success) {
          setIsPushOn(true);
          addAlert("PushOnFaild", "プッシュ通知をオフにできませんでした");
        }
      });
    }
  }, [isPushOn])

  return (
    <TopContext.Provider
      value={{
        addAlert,
        alertMessages,
        isPushOn,
        setIsPushOn,
      }}
    >{children}</TopContext.Provider>
  )
}
