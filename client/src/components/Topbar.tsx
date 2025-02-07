import React, { useMemo } from "react";
import { Link, useLocation } from 'react-router-dom';
import LogoImage from "../elements/images/logo.png";
import { Icon } from '@tremor/react';
import { RiExchangeCnyFill } from '@remixicon/react';
import { RiSettings5Fill } from '@remixicon/react';
import { RiNotificationFill } from '@remixicon/react';
import { RiGitBranchFill } from '@remixicon/react';
import { RiListUnordered } from '@remixicon/react';
import { RiTeamFill } from '@remixicon/react';

export default function Topbar(){
  const location = useLocation();
  const pathname = useMemo(()=>location.pathname, [location]);

  return (
    <div className="bg-gray-100 p-2 border-b-0">
      <div className="container mx-auto flex justify-between items-center px-2">
        <Link to={"/"} className={`flex gap-1 p-0.5 hover:bg-gray-300 ${pathname=="/"?"bg-gray-200":""}`}>
          <img src={LogoImage} className="w-8 h-8"/>
          <p className="text-lg font-semibold cursor-pointer hidden sm:block">CrowPay</p>
        </Link>

        <div className="ms-3 me-auto flex gap-2">
          <Link to={"/issue"} className={`nav-link text-center flex flex-col items-center p-2 hover:bg-gray-300 ${pathname=="/issue"?"bg-gray-200":""}`}>
            <Icon className="w-2 h-2 text-indigo-400" size="md" icon={RiExchangeCnyFill} />
            <p className="m-0 text-xs mt-1 text-gray-500">起票</p>
          </Link>
          <Link to={"/transaction"} className={`nav-link text-center flex flex-col items-center p-2 hover:bg-gray-300 ${pathname=="/transaction"?"bg-gray-200":""}`}>
            <Icon className="w-2 h-2 text-indigo-400" size="md" icon={RiListUnordered} />
            <p className="m-0 text-xs mt-1 text-gray-500">台帳</p>
          </Link>
        </div>
        <div className="flex gap-2">
          <Link to={"/graph"} className={`nav-link text-center flex flex-col items-center p-2 hover:bg-gray-300 ${pathname=="/graph"?"bg-gray-200":""}`}>
            <Icon className="w-2 h-2 text-indigo-400" size="md" icon={RiGitBranchFill} />
            <p className="m-0 text-xs mt-1 text-gray-500">Graph</p>
          </Link>
          <Link to={"/friend"} className={`nav-link text-center flex flex-col items-center p-2 hover:bg-gray-300 ${pathname=="/friend"?"bg-gray-200":""}`}>
            <Icon className="w-2 h-2 text-indigo-400" size="md" icon={RiTeamFill} />
            <p className="m-0 text-xs mt-1 text-gray-500">友だち</p>
          </Link>
          <Link to={"/notification"} className={`nav-link text-center flex flex-col items-center p-2 hover:bg-gray-300 ${pathname=="/notification"?"bg-gray-200":""}`}>
            <Icon className="w-2 h-2 text-indigo-400" size="md" icon={RiNotificationFill} />
            <p className="m-0 text-xs mt-1 text-gray-500">通知</p>
          </Link>
          <Link to={"/setting"} className={`nav-link text-center flex flex-col items-center p-2 hover:bg-gray-300 ${pathname=="/setting"?"bg-gray-200":""}`}>
            <Icon className="w-2 h-2 text-indigo-400" size="md" icon={RiSettings5Fill} />
            <p className="m-0 text-xs mt-1 text-gray-500">設定</p>
          </Link>
        </div>
      </div>
    </div>  
  );
}