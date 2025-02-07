import React, { useEffect, useRef, useState } from "react";
import { useTop } from "../../contexts/TopProvider";


export default function AlertBox(){
  
  const { alertMessages } = useTop();
  
  return (
    <div className="flex flex-col-reverse gap-4 shadow-lg">
      {
        alertMessages.map(({title, content, deleteAt})=>(
          <div key={deleteAt.getTime()} className="bg-gray-600 border-l-4 border-yellow-600 text-white text-base p-4 min-w-48">
            {title && <p className="font-bold">{title}</p>}
            {content && <p>{content}</p>}
          </div>
        ))
      }
    </div>
  )
}