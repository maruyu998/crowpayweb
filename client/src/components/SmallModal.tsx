import React from "react";

export default function SmallModal({
  children,
  isOpen,
  onClose,
  isStatic
}:{
  children: React.ReactNode
  isOpen: boolean,
  onClose: ()=>void,
  isStatic?: boolean
}){
  return (
    <div 
      className={`
        fixed flex items-center justify-center z-50 overscroll-contain 
        transition duration-300 ease-in-out transform
        w-full h-full top-0 left-0 max-w-full max-h-full
        ${(isOpen ? "" : " opacity-0 pointer-events-none")}
      `}
      onClick={e=>e.stopPropagation()}
    >
      {
        isOpen && <>
          <div className="w-full h-full bg-gray-600 opacity-50 fixed" 
            onClick={isStatic ? undefined : onClose}
          />
          <div className="bg-white rounded-lg z-50 overflow-y-auto">
            <div className="relative p-10">
              <div className="
                absolute top-2 right-2 p-1 w-8 h-8 z-50
                cursor-pointer
                text-gray-500 
                hover:bg-gray-200
              " onClick={onClose}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  strokeWidth={1.5} stroke="currentColor" className="w-full h-full"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              { children }
            </div>
          </div>        
        </>
      }
    </div>
  )
}