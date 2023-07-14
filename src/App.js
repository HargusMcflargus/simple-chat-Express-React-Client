import React, { useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import { ToastContainer, toast,} from "react-toastify"
import Registration from './components/Registration'
import "react-toastify/dist/ReactToastify.css"
import ChatThread from './components/ChatThread'
import Contacts from './components/Contacts'
import { clear } from '@testing-library/user-event/dist/clear'

function App() {

    const [ loggedIn, setLoggedStatus ] = useState(null)
    const [ registering, setRegisterStatus ] = useState(false)
    const [ chatting, setChatting ] = useState(null)
    const [ chattingDisplayName, setChattingDisplayName ] = useState(null)
    const [ username, setUsername ] = useState('')
    const [ contacts, setContacts ] = useState(false)

    useEffect(() => {
        setLoggedStatus( localStorage.getItem("loggedIn") )
        setRegisterStatus( localStorage.getItem('registering'))
        setChatting( localStorage.getItem('chatting'))
        setUsername( localStorage.getItem('username'))
        setContacts( localStorage.getItem('contacts'))
    }, [])

    const handleLogout = ( ) => {
        localStorage.removeItem("loggedIn")
        setLoggedStatus(null)
        localStorage.removeItem('loggedIn')
        setUsername('')
        localStorage.removeItem('username')
        setContacts(false)
        localStorage.removeItem('contacts')
    }

    const handleLogin = async ( username, password) => {
        await fetch("http://localhost:5000/users/auth/", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
            .then( async response => await response.json())
            .then( data => {
                if( data.length > 0 ){
                    setLoggedStatus( data[0]._id )
                    localStorage.setItem("loggedIn", data[0]._id )
                    localStorage.setItem('username', username)
                    setUsername(data[0].username)
                }else{
                    toast.error("User Not Found")
                }
            })
    }

    const handleRegister = ( username, password ) => {
        try{
            let infoToast = toast('👌 Registering User, Please Wait', {
                position: "top-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            fetch("http://localhost:5000/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            }).then( responses => {
                toast.dismiss(infoToast)
                setRegisterStatus(false)
                toast.success("User has successfully registered")
            })
        } catch ( e ) {
            console.log(e)
        }
    }


    return (
        <>
            <ToastContainer />
            {
                contacts
                    ?   <Contacts  setChattingDisplayName={ setChattingDisplayName } setContacts={ setContacts } setChatting={ setChatting } loggedIn={ loggedIn } logoutHandler={ handleLogout } WholeName={ username } setLoggedStatus={ setLoggedStatus } />
                    :   chatting != null
                        ?   <ChatThread username={ username } loggedIn={ loggedIn } setChatting={ setChatting } ThreadName={ chatting } chattingDisplayName={ chattingDisplayName } />
                        :   registering 
                            ?   <Registration setStatus={ setRegisterStatus } registrationHandler={ handleRegister } />
                            : loggedIn == null
                                ?   <LoginForm  setRegistrationStatus={ setRegisterStatus } loginHandler={ handleLogin } setStatus={ setLoggedStatus } /> 
                                :   <Dashboard  setContacts={ setContacts } setChattingDisplayName={ setChattingDisplayName } setLoggedStatus={ setLoggedStatus } setChatting={ setChatting } loggedIn={ loggedIn } logoutHandler={ handleLogout } WholeName={ username } />
            }
        </>
    )
}

export default App