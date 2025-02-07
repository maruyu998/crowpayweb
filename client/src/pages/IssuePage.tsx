import React, { useState } from "react";
import Topbar from "../components/Topbar";
import { Card } from '@tremor/react';
import SendIcon from '../elements/images/send.svg';
import ClaimIcon from '../elements/images/request.svg';
import Claim from "../components/issue/Claim";
import Send from "../components/issue/Send";

export default function IssuePage(){

  const [ mode, setMode ] = useState<"claim"|"send"|null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="container mx-auto px-6 mb-8 mt-4">
        <div className="flex gap-6 justify-center">
          <Card 
            className={`
              max-w-xs text-center shadow hover:bg-gray-100 cursor-pointer border-4 p-4
              ${mode=="claim" ? "border-blue-500" : "border-white"}
              ${mode==null ? "py-4" : "py-2"}
            `} 
            onClick={e=>setMode(mode=="claim"?null:"claim")}
          >
            { mode==null && <img className="w-24 mx-auto" src={ClaimIcon}></img> }
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">請求</h5>
            { mode==null && 
              <div className="font-normal text-sm text-gray-600">
                <p>CrowPay上での請求です</p>
                <p>現実世界でお金を送った・返金した場合の調整はこちら</p>
              </div>
            }
          </Card>
          <Card 
            className={`
              max-w-xs text-center shadow hover:bg-gray-100 cursor-pointer border-4 p-4
              ${mode=="send"?"border-blue-500":"border-white"}
              ${mode==null ? "py-4" : "py-2"}
            `} 
            onClick={e=>setMode(mode=="send"?null:"send")}
          >
            { mode == null && <img className="w-24 mx-auto" src={SendIcon}></img> }
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">送金</h5>
            { mode == null && 
              <div className="font-normal text-sm text-gray-600">
                <p>CrowPay上での送金です</p>
                <p>現実世界でお金を借りた・返金された場合の調整はこちら</p>
              </div>
            }
          </Card>
        </div>
      </div>
      { mode == "claim" && <Claim /> }
      { mode == "send" && <Send /> }
    </div>
  );
}