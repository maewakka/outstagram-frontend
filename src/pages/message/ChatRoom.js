// import React, {useEffect, useRef, useState} from 'react';
// import style from "./ChatRoom.module.css";
// import withJwtAxios from "../../components/axios/withJwtAxios";
// import * as SockJs from 'sockjs-client';
// import {useSelector} from "react-redux";
// import {Static_Base_Url} from "../../index";
// import {Stomp} from '@stomp/stompjs';

// const ChatRoom = (props) => {

//     const chatRoomId = props.chatRoom;
//     const targetEmail = props.targetEmail;
//     const [inputs, setInputs] = useState("");
//     const [chatting, setChatting] = useState();
//     const [chatList, setChatList] = useState();
//     const userDetail = useSelector(state => state.userDetail);

//     const stomp = useRef({});

//     const sock = new SockJs("http://localhost:8080/socket")
//     stomp.current = Stomp.over(sock);


//     const headers = {
//         'Authorization': localStorage.getItem("accessToken")
//     }

//     const onSubmit = () => {
//         let value = JSON.stringify(inputs);
//         value = value.slice(1, value.length-1)

//         if(value) {
//             const data = {
//                 chatRoomId: chatRoomId,
//                 message: inputs
//             }
//             withJwtAxios.post("/chats/chat", data)
//                 .then((res) => {
//                     setChatList(res.data.chatList);
//                 });

//             console.log(stomp);

//             stomp.current.send("/publish/messages", headers, JSON.stringify({
//                 message: inputs,
//                 senderEmail: userDetail.email,
//                 receiverEmail: targetEmail,
//                 chatRoomId: chatRoomId
//             }), (res) => {
//                 console.log(res.data.body);
//             })

//             setInputs("");
//         }
//     }

//     const onKeyPress = (e) => {
//         if(e.key == 'Enter') {
//             onSubmit();
//         }
//     }

//     useEffect(() => {
//         if(chatRoomId != undefined) {
//             withJwtAxios.get("/chats/chat-list", {params: {chatRoomId: chatRoomId}})
//                 .then((res) => {
//                     setChatList(res.data.chatList);
//                 })

//             stomp.current.connect(headers, () => {
//                 stomp.current.subscribe('/subscribe/rooms/' + chatRoomId,  (res) => {
//                     const obj = JSON.parse(res.body)
//                     console.log(obj)
//                     setChatting({
//                         email: obj.email,
//                         nickname: obj.nickname,
//                         profileUrl: obj.profileUrl,
//                         content: obj.content
//                     })
//                 }, headers)
//             });
//         }
//     }, [chatRoomId])

//     useEffect(() => {
//         if(chatList != undefined) {
//             let tmp = [...chatList];
//             tmp.push(chatting);
//             setChatList(tmp);
//         }
//     }, [chatting])

//     const onChange = (e) => {
//         setInputs(e.target.value);
//     }

//     return (
//         <>
//             <div className={style.chat_body_container}>
//                 <div>
//                     {chatList != undefined ? chatList.map((chat, idx) => {
//                         if(chat.email === userDetail.email) {
//                             return(
//                                 <div key={idx} className={style.my_chat}>
//                                     <div className={style.my_chat_box}>
//                                         {chat.content}
//                                     </div>
//                                 </div>
//                             )
//                         } else {
//                             if(idx > 0) {
//                                 return(
//                                     <div key={idx} className={style.oppo_chat}>
//                                         {chatList[idx-1].email !== chat.email ?
//                                             <img className={style.thumbnail} src={chat.profileUrl} /> :
//                                             <div className={style.thumbnail_blank}></div>}
//                                         <div className={style.oppo_chat_box}>
//                                             {chat.content}
//                                         </div>
//                                     </div>
//                                 )
//                             } else {
//                                 return(
//                                     <div key={idx} className={style.oppo_chat}>
//                                         <img className={style.thumbnail} src={chat.profileUrl} />
//                                         <div className={style.oppo_chat_box}>
//                                             {chat.content}
//                                         </div>
//                                     </div>
//                                     )
//                             }

//                         }


//                         }) :
//                     <div></div>
//                     }
//                 </div>
//             </div>
//             <div className={style.input_container}>
//                 <input className={style.input} value={inputs} onChange={onChange} onKeyPress={onKeyPress}/>
//                 <button className='btn btn-outline-primary' onClick={onSubmit}>보내기</button>
//             </div>

//         </>
//     );
// };

// export default ChatRoom;

import React, { useEffect, useRef, useState } from 'react';
import style from "./ChatRoom.module.css";
import withJwtAxios from "../../components/axios/withJwtAxios";
import { useSelector } from "react-redux";
import { Stomp } from '@stomp/stompjs';
import SockJs from 'sockjs-client';

const ChatRoom = (props) => {

    const chatRoomId = props.chatRoom;
    const targetEmail = props.targetEmail;
    const [inputs, setInputs] = useState("");
    const [chatting, setChatting] = useState();
    const [chatList, setChatList] = useState([]);
    const userDetail = useSelector(state => state.userDetail);
    const [connected, setConnected] = useState(false); // 연결 상태를 추적합니다.

    const stomp = useRef(null);

    const headers = {
        'Authorization': localStorage.getItem("accessToken")
    };

    const connect = () => {
        const socket = new SockJs("/socket");
        stomp.current = Stomp.over(socket);

        stomp.current.connect(headers, () => {
            console.log('Connected to WebSocket');
            setConnected(true); // 연결 상태를 true로 설정합니다.
            stomp.current.subscribe('/subscribe/rooms/' + chatRoomId, (res) => {
                const obj = JSON.parse(res.body);
                setChatting({
                    email: obj.email,
                    nickname: obj.nickname,
                    profileUrl: obj.profileUrl,
                    content: obj.content
                });
            }, headers);
        }, (error) => {
            console.error('Connection error', error);
            setConnected(false); // 연결 실패 시 상태를 false로 설정합니다.
        });
    };

    useEffect(() => {
        if (chatRoomId !== undefined) {
            withJwtAxios.get("/chats/chat-list", { params: { chatRoomId: chatRoomId } })
                .then((res) => {
                    setChatList(res.data.chatList);
                });

            connect();
        }
    }, [chatRoomId]);

    useEffect(() => {
        if (chatList !== undefined && chatting) {
            setChatList(prevChatList => [...prevChatList, chatting]);
        }
    }, [chatting]);

    const sendMessage = () => {
        if (connected && stomp.current) {
            const message = {
                message: inputs,
                senderEmail: userDetail.email,
                receiverEmail: targetEmail,
                chatRoomId: chatRoomId
            };
            stomp.current.send("/publish/messages", headers, JSON.stringify(message));
        } else {
            console.error('STOMP client is not connected');
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (inputs) {
            const data = {
                chatRoomId: chatRoomId,
                message: inputs
            };
            withJwtAxios.post("/chats/chat", data)
                .then((res) => {
                    setChatList(res.data.chatList);
                });

            sendMessage();
            setInputs("");
        }
    };

    const onKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSubmit(e);
        }
    };

    const onChange = (e) => {
        setInputs(e.target.value);
    };

    return (
        <>
            <div className={style.chat_body_container}>
                <div>
                    {chatList.map((chat, idx) => (
                        chat.email === userDetail.email ? (
                            <div key={idx} className={style.my_chat}>
                                <div className={style.my_chat_box}>
                                    {chat.content}
                                </div>
                            </div>
                        ) : (
                            <div key={idx} className={style.oppo_chat}>
                                {idx > 0 && chatList[idx - 1].email !== chat.email ? (
                                    <img className={style.thumbnail} src={chat.profileUrl} />
                                ) : (
                                    <div className={style.thumbnail_blank}></div>
                                )}
                                <div className={style.oppo_chat_box}>
                                    {chat.content}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
            <div className={style.input_container}>
                <input className={style.input} value={inputs} onChange={onChange} onKeyPress={onKeyPress} />
                <button className='btn btn-outline-primary' onClick={onSubmit}>보내기</button>
            </div>
        </>
    );
};

export default ChatRoom;
