import React, { useEffect, useState } from 'react'
import ChatHead from './ChatHead'
import { toast } from 'react-toastify'

export default function Dashboard(props) {

    const [ chatHeads, setChatHeads ] = useState([])
    const [ totalMessages, setTotalMessages ] = useState(0)
    useEffect( ( ) => {
        props.setLoggedStatus( localStorage.getItem("loggedIn") )
        fetch("http://localhost:5000/interface/getChatHeads/" + props.loggedIn, {
            method: "GET",
            headers: {"content-type": "application/json"}
        })  
            .then( response => response.json())
            .then( data => {
                setChatHeads(data)
            })
        fetch("http://localhost:5000/interface/getMessages/" + props.loggedIn, {
            method: "GET",
            headers: {"content-type": "application/json"}
        })
            .then( response => response.json())
            .then( data => setTotalMessages(data.length))
        const interval = setInterval(
            ( ) => {
                fetch("http://localhost:5000/interface/getMessages/" + props.loggedIn, {
                    method: "GET",
                    headers: {"content-type": "application/json"}
                })  
                    .then( response => response.json())
                    .then( data => {
                        const current = totalMessages
                        if( current < data.length ){
                            let sender = data[0].receiver === props.loggedIn ? data[0].senderDisplayName : data[0].receiverDisplayName
                            toast.info("New Message 📧 from  " + sender)
                            setTotalMessages(data.length)
                        }
                    })
            },
            5000
        )
        return ( ) => clearInterval(interval)
    }, [props, totalMessages])

    return (
        <>
            <div className="flex flex-col justify-center text-gray-600 w-full p-4 transition-all duration-300">
                <div className="h-full w-full">
                    <div className="relative w-full mx-auto bg-white shadow-lg rounded-lg">
                        <header className="pt-6 pb-4 px-5 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center">
                                    {/* <a className="inline-flex items-start mr-3" href="/0">
                                        <img className="rounded-full" src="https://res.cloudinary.com/dc6deairt/image/upload/v1638102932/user-48-01_nugblk.jpg" width="48" height="48" alt="Lauren Marsano" />
                                    </a> */}
                                    <div className="pr-1">
                                        <a className="inline-flex text-gray-800 hover:text-gray-900" href="/0">
                                            <h2 className="text-xl leading-snug font-bold">{ props.WholeName || localStorage.getItem('username')}</h2>
                                        </a>
                                    </div>
                                </div>
                                <div className='flex items-center gap-4 '>
                                    <button className='bg-primary px-6 py-2 text-white rounded-3xl' >Chats</button>
                                    <button onClick={ e => { props.setContacts(true); localStorage.setItem('contacts', true) }} className='bg-transparent hover:bg-primary border border-primary hover:text-white transition-all duration-300 px-6 py-2 text-black rounded-3xl' >Contacts</button>
                                    <button onClick={ e => props.logoutHandler( ) } className='hover:bg-red-500 bg-transparent border border-red-500 text-black transition-all duration-300 px-6 py-2 hover:text-white rounded-3xl' >Logout</button>
                                </div>
                            </div>
                        </header>
                        <div className="py-3 px-5">
                            <h3 className="text-xs font-semibold uppercase text-gray-400 mb-1">Chats</h3>
                            <div className="divide-y divide-gray-200">
                                {
                                    chatHeads.length && chatHeads.map( ( chat, index ) => {
                                        return (
                                            <ChatHead setContacts={ props.setContacts } key={ index } loggedIn={ props.loggedIn } setChattingDisplayName={ props.setChattingDisplayName } ThreadID={ chat.sender === props.loggedIn ? chat.receiver : chat.sender } setChatting={ props.setChatting } ThreadName={ chat.sender === props.loggedIn ? chat.receiverDisplayName : chat.senderDisplayName } Message={ chat.message } />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
