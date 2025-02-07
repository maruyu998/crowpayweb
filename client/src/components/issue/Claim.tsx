import { useEffect, useState } from "react";
import { useUserInfo } from "../../contexts/UserInfoProvider";
import { Card, Switch } from "@tremor/react";
import { Divider } from '@tremor/react';
import { TextInput } from '@tremor/react';
import { NumberInput } from '@tremor/react';
import { Button } from '@tremor/react';
import { Table, TableBody, TableCell, TableRow } from '@tremor/react';
import { FriendClientType } from "../../../../mtypes/FriendType";
import { sum } from "maruyu-webcommons/commons/utils/number";
import { issueTransaction } from "../../data/transaction";
import { useTop } from "../../contexts/TopProvider";
import { useNavigate } from "react-router-dom";
import FriendHorizontalList from "../friend/FriendHorizontalList";

export default function Claim({

}:{

}){
  const navigate = useNavigate();
  const { addAlert } = useTop();
  const { user, friendList, refreshFriendList } = useUserInfo();
  useEffect(()=>{ 
    if(user == null) return;
    refreshFriendList();
  }, [user]);

  const [ selectingFriendList, setSelectingFriendList ] = useState<(FriendClientType&{dealAmount?:number})[]>([]);
  const [ isSplitting, setIsSplitting ] = useState<boolean>(false);
  const [ isEnterSameAmount, setIsEnterSameAmount ] = useState<boolean>(false);
  const [ isIncludeMeSplitting, setIsIncludeMeSplitting ] = useState<boolean>(false);

  function setDealAmount(friend:FriendClientType, dealAmount:number){
    setSelectingFriendList(selectingFriendList.map(f=>f.friendUserId!=friend.friendUserId?f:({...f,dealAmount})))
  }

  const [ content, setContent ] = useState<string>("");
  const [ sumAmount, setSumAmount ] = useState<number>(0);
  const [ eachAmount, setEachAmount ] = useState<number>(0);
  function calcSplit(){
    if(!isSplitting) return;
    if(isEnterSameAmount){
      const dict:Record<string,number> = Object.assign({}, ...selectingFriendList.map((f,i)=>({[f.friendUserId]:eachAmount})));
      setSelectingFriendList(selectingFriendList.map(f=>({...f, dealAmount:dict[f.friendUserId]})));
      for(const [userId, dealAmount] of Object.entries(dict)){
        const inp = document.getElementById(`claimDealAmount_${userId}`) as HTMLInputElement|null;
        if(inp) inp.value = String(dealAmount);
      }
    }else{
      const size = selectingFriendList.length + (isIncludeMeSplitting ? 1 : 0);
      const each = Math.floor(sumAmount / size);
      const list = [...Array(size)].map(()=>each);
      for(let i=0; sum(list)<sumAmount; i++){ list[i] += 1; }
      console.assert(sumAmount == sum(list));
      const dict:Record<string,number> = Object.assign({}, ...selectingFriendList.map((f,i)=>({[f.friendUserId]:list[i]})));
      setSelectingFriendList(selectingFriendList.map(f=>({...f, dealAmount:dict[f.friendUserId]})));
      for(const [userId, dealAmount] of Object.entries(dict)){
        const inp = document.getElementById(`claimDealAmount_${userId}`) as HTMLInputElement|null;
        if(inp) inp.value = String(dealAmount);
      }
    }
  }
  useEffect(()=>{ 
    if(!isSplitting) { setSumAmount(0); setEachAmount(0); }
  }, [isSplitting])

  async function submitHandler(){
    if(user == null) return addAlert(`IssueError`, "user is null");
    if(content.length == 0) return addAlert(`IssueError`, "content is empty");
    for(const friend of selectingFriendList){
      if(friend.dealAmount == 0) return addAlert(`IssueError`, `${friend.friendUserName}'s amount is 0`);
    }
    for(const friend of selectingFriendList){
      await issueTransaction({ 
        receiverUserId: user.userId,
        senderUserId: friend.friendUserId,
        content,
        amount: friend.dealAmount??0,
      }).then(()=>{
      }).catch(error=>{
        return addAlert(`IssueError [${error.name}]`, error.message)
      })
    }
    addAlert("Claim Success", null);
    navigate('/transaction');
  }

  return (
    <div className="px-6">
      <div className="max-w-[48rem] mx-auto pb-12">
        <h2 className="text-lg">請求内容</h2>
        <TextInput 
          onValueChange={text=>setContent(text)}
          error={content.length == 0}
          errorMessage="入力してください"
        />
        <Divider className="my-4"/>
        <h2 className="text-lg">請求する相手を選択</h2>
        <FriendHorizontalList 
          showingSortKeys={["lastDealedAt","alphabet","amount"]}
          friendList={friendList.filter(friend=>friend.status=="friend")}
          selectingFriendList={selectingFriendList}
          setSelectingFriendList={setSelectingFriendList}
        />
        {
          selectingFriendList.length > 0 && <>
            <Divider className="my-4"/>
            <h2 className="text-lg">金額を入力</h2>
            <div className="flex my-4">
              <Switch
                id="splitSwitch"
                name="splitSwitch"
                checked={isSplitting}
                onChange={setIsSplitting}
              />
              <label 
                htmlFor="splitSwitch" 
                className="text-tremor-default text-tremor-content"
              >割勘計算</label>
            </div>
            {
              isSplitting && (
                <>
                  <div className="flex my-4">
                    <Switch
                      id="isEnterSameAmount"
                      name="isEnterSameAmount"
                      checked={isEnterSameAmount}
                      onChange={setIsEnterSameAmount}
                    />
                    <label 
                      htmlFor="isEnterSameAmount" 
                      className="text-tremor-default text-tremor-content"
                    >割った金額を入力する</label>
                  </div>
                  {
                    isEnterSameAmount ? (
                      <NumberInput 
                        id={`claimDealEachAmount`}
                        onValueChange={value=>setEachAmount(value??0)}
                        enableStepper={false}
                        min={1}
                        max={200000}
                        required={true}
                        placeholder="各人請求金額"
                        error={eachAmount <= 0}
                        errorMessage="正数を入力してください"
                        onWheel={e=>e.currentTarget.blur()}
                      />
                    ) : (
                      <NumberInput 
                        id={`claimDealAmountSum`}
                        onValueChange={value=>setSumAmount(value??0)}
                        enableStepper={false}
                        min={1}
                        max={200000}
                        required={true}
                        placeholder="合計金額"
                        error={sumAmount <= 0}
                        errorMessage="正数を入力してください"
                        onWheel={e=>e.currentTarget.blur()}
                      />
                    )
                  }
                  {
                    !isEnterSameAmount &&
                    <div className="flex my-4">
                      <Switch
                        id="isIncludeMeSplitting"
                        name="isIncludeMeSplitting"
                        checked={isIncludeMeSplitting}
                        onChange={setIsIncludeMeSplitting}
                      />
                      <label 
                        htmlFor="isIncludeMeSplitting" 
                        className="text-tremor-default text-tremor-content"
                      >自分も含めて割り勘にする</label>
                    </div>
                  }
                  <Button 
                    variant="primary"
                    onClick={calcSplit}
                  >割勘計算を反映</Button>
                  {
                    !isEnterSameAmount && isIncludeMeSplitting && 
                    <p className="mt-2 text-gray-600 text-sm">
                      自分の割勘金額: ¥ {Intl.NumberFormat('en-US').format(sumAmount - sum(selectingFriendList.map(f=>f.dealAmount??0)))}
                    </p>
                  }
                  <Divider className="my-4"/>
                </>
              )
            }
            <div className="flex flex-col w-full overflow-x-auto">
              <Table className="mt-2">
                <TableBody>
                  {selectingFriendList.map(friend=>(
                    <TableRow key={friend.friendUserId}>
                      <TableCell className="p-2">{friend.friendUserName}</TableCell>
                      <TableCell className="p-2">
                        <NumberInput
                          id={`claimDealAmount_${friend.friendUserId}`}
                          onValueChange={value=>setDealAmount(friend,value??0)}
                          placeholder="請求金額"
                          enableStepper={false}
                          min={1}
                          max={200000}
                          required={true}
                          onWheel={e=>e.currentTarget.blur()}
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Button 
                          variant="secondary"
                          className="text-sm"
                          onClick={e=>setSelectingFriendList(selectingFriendList.filter(f=>f.friendUserId!=friend.friendUserId))}
                          tabIndex={-1}
                        >Remove</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="font-semibold text-center">
              合計請求金額: ¥ {Intl.NumberFormat('en-US').format(sum(selectingFriendList.map(f=>f.dealAmount??0)))}
            </p>
            <Divider className="my-4"/>
            <div className="flex justify-center">
              <Button variant="primary" onClick={submitHandler}>請求する</Button>
            </div>
          </>
        }
      </div>
    </div>
  );
}