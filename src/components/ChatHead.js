import React from 'react'

export default function ChatHead(props){
    return(
        <>
            <button onClick={ 
                    e => { 
                        props.setContacts(false); 
                        localStorage.removeItem('contacts'); 
                        props.setChatting(props.ThreadID); 
                        props.setChattingDisplayName(props.ThreadName); 
                        localStorage.setItem('chatting', props.ThreadID) 
                    }} 
                    className="w-full text-left py-2 focus:outline-none focus-visible:bg-indigo-50">
                <div className="flex items-center">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900"> { props.ThreadName } </h4>
                        <div className="text-[13px]">{ props.Message }</div>
                    </div>
                </div>
            </button>

        </>
    )
}   