import { useEffect, useMemo, useState } from "react";
import { useTop } from "../../contexts/TopProvider";
import { useUserInfo } from "../../contexts/UserInfoProvider";
import { Card } from "@tremor/react";
import { setAvailableWallet } from "../../data/user";

export default function SetAvailableWallet({

}:{

}){

  const { addAlert } = useTop();
  const { user, refreshUser, walletList, convertWalletIdToName } = useUserInfo();
  const [ selectedWalletIds, setSelectedWalletIds ] = useState<string[]>([]);
  useEffect(()=>{
    if(user == null) return;
    setSelectedWalletIds(user.walletIdList);
  }, [user, walletList])
  
  function toggleHandler(walletId:string){
    if(user == null) return addAlert("ToggleError", "user is empty");
    const newSelectedWalletIds = selectedWalletIds.includes(walletId) 
                                ? [...selectedWalletIds.filter(i=>i!=walletId)]
                                : [...selectedWalletIds, walletId];
    setSelectedWalletIds(newSelectedWalletIds);
    setAvailableWallet({ walletIdList: newSelectedWalletIds })
    .then(()=>{ refreshUser() })
    .catch(error=>{
      addAlert(`ToggleError[${error.name}]`, error.message);
    })
  }

  return (
    <>
      <p className="text-sm font-bold">
        {selectedWalletIds.map(i=>convertWalletIdToName(i)).join(" / ")??""}
      </p>
      <div className="flex gap-4 px-4 py-4 w-full overflow-x-auto">
        {walletList.map(wallet=>(
          <Card
            key={wallet.walletId}
            className={`
              shadow-lg border-4 p-2 min-w-fit cursor-pointer
              ${selectedWalletIds.find(wid=>wid==wallet.walletId)
                ? "bg-slate-300 border-blue-400" 
                : "bg-white border-white"
              }
            `}
            onClick={e=>{ toggleHandler(wallet.walletId) }}
          >
            <p className="font-bold text-sm">{wallet.walletName}</p>
          </Card>
        ))}
      </div>
    </>
  );
}