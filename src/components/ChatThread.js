import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function ChatThread(props) {

    const [ threadHistory, setHistory ] = useState([])
    const [ total, setTotal ] = useState(0)
    const [ message, setMessage ] = useState('') 
    const [ totalMessages, setTotalMessages ] = useState(0)

    useEffect( ( ) => {
        props.setChatting( localStorage.getItem('chatting'))
        fetch("http://localhost:5000/interface/getHistory/"+ props.loggedIn +"/" + props.ThreadName)
            .then( response => response.json() )
            .then( data => {
                setHistory( data )
                setTotal( data.lenght )
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
    }, [])

    const sendMessage = async (  ) => {
        let infoToast = toast('🔃 Sending Message', {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setMessage('')
        fetch( "http://localhost:5000/message/send" , {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                sender: props.loggedIn,
                receiver: props.ThreadName,
                senderDisplayName: props.username,
                receiverDisplayName: props.chattingDisplayName
            })
        })
            .then( response => response.json() )
            .then( data => {
                toast.dismiss(infoToast)
                toast.success("Message Has been sent")
                setHistory( 
                    prev => [
                        ...prev, {
                            message: message,
                            sender: props.loggedIn,
                            receiver: props.ThreadName,
                            senderDisplayName: props.username,
                            receiverDisplayName: props.chattingDisplayName
                        }
                    ]
                )
            })
            .catch( e => toast.error( e ))
    }


    return (
        <>
            <div className="bg-gray-200">
                <div className="mx-auto py-8 h-100">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md h-100">
                        <div className="py-4 px-6 border-b border-gray-300 flex flex-row gap-4">
                            <button 
                                onClick={ e => {
                                    props.setChatting(null)
                                    localStorage.removeItem('chatting')
                                }}
                                className='bg-primary px-4 py-2 rounded-2xl border border-transparent text-white hover:bg-transparent hover:border-primary hover:text-black transition-all duration-150'>Return</button>
                            <h1 className="text-xl font-semibold align-middle">Messaging Thread : { props.chattingDisplayName }</h1>
                        </div>
                        <div className="px-6 py-4">

                            {/* Container */}
                            { 
                                threadHistory && threadHistory.map( (messsage, index) => {
                                    return(
                                        <div className="mb-4" key={ index }>
                                            <div className="flex items-center mb-2">
                                                <div className="ml-2">
                                                    <h2 className="text-gray-900 font-semibold">{ messsage.senderDisplayName }</h2>
                                                </div>
                                            </div>
                                            <p className="text-gray-800 ms-4">{ messsage.message }</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="px-6 py-4">
                            <div className="flex">
                                <input 
                                    value={ message }
                                    onInput={ e => {
                                        setMessage( e.currentTarget.value )
                                    }}
                                    type="text" className="flex-grow px-4 rounded-l-lg border border-gray-300 focus:outline-none focus:border-blue-500" placeholder="Type a message..." />
                                <button 
                                    onClick={ e => {
                                        sendMessage()
                                    }} 
                                    className="py-4 px-4 rounded-r-lg border hover:border-transparent text-black border-primary hover:bg-primary hover:text-white  transition-all duration-150">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
