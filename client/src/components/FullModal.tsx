import React from "react";

export default function FullModal({
  children,
  isOpen,
  onClose,
}:{
  children: React.ReactNode
  isOpen: boolean,
  onClose: ()=>void,
}){
  return (
    // <div className="relative z-10">
    //   <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
    //   <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
    //     <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
    //       <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
    //         { children }
            //   <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            //   <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Deactivate</button>
            //   <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
            // </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className={`
      modal fixed flex items-center justify-center z-50 overscroll-contain 
      transition duration-300 ease-in-out transform
      w-full h-full top-0 left-0 max-w-full max-h-full
      ${(isOpen ? "" : " opacity-0 pointer-events-none")}
      `}>
      <div className="modal-overlay w-full h-full bg-gray-900 opacity-50 fixed" onClick={onClose}/>
      <div className="
        modal-container bg-white z-50 overflow-y-auto
        px-4
        md:rounded md:shadow-lg 
        md:min-w-6xl
        md:max-w-[calc(100%-3rem)]
        md:h-[calc(100%-3rem)]
        min-h-full md:min-h-fit
        max-h-full
        md:inset-0 
        w-full lg:max-w-6xl
      ">
        <div className="modal-content py-4 text-left px-2 mt-2">
          <div className="h-6">
            <div className="modal-close cursor-pointer z-50 content-end w-fit ms-auto" onClick={onClose}>
              <svg className="fill-current text-black text-right" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          { isOpen && children }
        </div>
      </div>
    </div>
  )
}