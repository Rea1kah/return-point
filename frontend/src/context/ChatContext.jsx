import { createContext, useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState('list'); 
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const socket = useRef(null);
    
    const stateRef = useRef({ isOpen: false, activeChatId: null, currentActiveChat: null });

    useEffect(() => {
        stateRef.current = { 
            isOpen, 
            activeChatId: activeChat ? activeChat.roomId : null,
            currentActiveChat: activeChat
        };
    }, [isOpen, activeChat]);

    useEffect(() => {
        if (!user) {
            setConversations([]);
            setMessages([]);
            setActiveChat(null);
            return;
        }

        const storageKey = `conversations_${user.id}`;
        const storedConvos = JSON.parse(localStorage.getItem(storageKey)) || [];
        setConversations(storedConvos);

        const BACKEND_URL = import.meta.env.VITE_API_URL 
            ? import.meta.env.VITE_API_URL.replace('/api', '') 
            : 'http://localhost:4000';

        const newSocket = io(BACKEND_URL);
        socket.current = newSocket;

        newSocket.emit('register_user', user.id);

        newSocket.on('sync_conversations', (serverRooms) => {
            setConversations((prev) => {
                const newMap = new Map();
                prev.forEach(c => newMap.set(c.roomId, c));

                serverRooms.forEach(item => {
                    const msg = item.lastMessageData;
                    const isMyMessage = String(msg.authorId) === String(user.id);
                    
                    if (newMap.has(item.roomId)) {
                        const existing = newMap.get(item.roomId);
                        newMap.set(item.roomId, {
                            ...existing,
                            lastMessage: msg.message,
                            time: msg.time,
                            unread: existing.unread 
                        });
                    } else {
                        if (!isMyMessage) {
                            newMap.set(item.roomId, {
                                roomId: item.roomId,
                                participantName: msg.author,
                                participantId: msg.authorId,
                                lastMessage: msg.message,
                                time: msg.time,
                                unread: true 
                            });
                        }
                    }
                });

                const mergedList = Array.from(newMap.values());
                localStorage.setItem(storageKey, JSON.stringify(mergedList));
                return mergedList;
            });
        });

        newSocket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);
            updateConversationList(data, false);
        });

        newSocket.on('load_history', (history) => {
            setMessages(history);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const updateConversationList = (msgData, isMyMessage) => {
        setConversations((prev) => {
            const existingIndex = prev.findIndex(c => c.roomId === msgData.room);
            let updatedList = [...prev];

            const isActive = stateRef.current.isOpen && stateRef.current.activeChatId === msgData.room;
            const shouldMarkUnread = !isMyMessage && !isActive;

            if (existingIndex > -1) {
                updatedList[existingIndex] = {
                    ...updatedList[existingIndex],
                    lastMessage: msgData.message,
                    time: msgData.time,
                    unread: shouldMarkUnread ? true : (isActive ? false : updatedList[existingIndex].unread)
                };
            } else {
                let targetName, targetId;

                if (isMyMessage) {
                    const currentActive = stateRef.current.currentActiveChat; 
                    targetName = currentActive ? (currentActive.username || currentActive.reporter_name) : 'User';
                    targetId = currentActive ? currentActive.id : null;
                } else {
                    targetName = msgData.author;
                    targetId = msgData.authorId;
                }

                updatedList.push({
                    roomId: msgData.room,
                    participantName: targetName,
                    participantId: targetId,
                    lastMessage: msgData.message,
                    time: msgData.time,
                    unread: shouldMarkUnread
                });
            }
            
            if (user) {
                localStorage.setItem(`conversations_${user.id}`, JSON.stringify(updatedList));
            }
            return updatedList;
        });
    };

    const startChat = (targetUser) => {
        if (!user || !targetUser) return;
        const roomId = [String(user.id), String(targetUser.id)].sort().join('_');
        
        const chatUserData = {
            id: targetUser.id,
            username: targetUser.username || targetUser.reporter_name,
            roomId
        };

        setActiveChat(chatUserData);
        setMessages([]);
        setIsOpen(true);
        setView('room'); 

        const exists = conversations.find(c => c.roomId === roomId);
        if (!exists) {
            const newConvo = {
                roomId,
                participantName: chatUserData.username,
                participantId: chatUserData.id,
                lastMessage: 'Mulai percakapan',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unread: false
            };
            const newList = [...conversations, newConvo];
            setConversations(newList);
            localStorage.setItem(`conversations_${user.id}`, JSON.stringify(newList));
        } else {
            markAsRead(roomId);
        }

        if (socket.current) {
            socket.current.emit('join_room', roomId);
        }
    };

    const markAsRead = (roomId) => {
        setConversations(prev => {
            const newList = prev.map(c => 
                c.roomId === roomId ? { ...c, unread: false } : c
            );
            if (user) localStorage.setItem(`conversations_${user.id}`, JSON.stringify(newList));
            return newList;
        });
    };

    const sendMessage = (text) => {
        if (!text.trim() || !activeChat || !user || !socket.current) return;

        const messageData = {
            room: activeChat.roomId,
            author: user.username,
            authorId: user.id,
            message: text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        socket.current.emit('send_message', messageData);
        setMessages((prev) => [...prev, messageData]);
        updateConversationList(messageData, true);
    };

    const deleteConversation = (roomId) => {
        const newList = conversations.filter(c => c.roomId !== roomId);
        setConversations(newList);
        if (user) {
            localStorage.setItem(`conversations_${user.id}`, JSON.stringify(newList));
        }
        if (activeChat && activeChat.roomId === roomId) {
            setView('list');
            setActiveChat(null);
        }
    };

    const toggleChat = () => setIsOpen(!isOpen);
    const goToList = () => {
        setView('list');
        setActiveChat(null);
    };

    const goToRoom = (convo) => {
        setActiveChat({ 
            id: convo.participantId, 
            username: convo.participantName, 
            roomId: convo.roomId 
        });
        setMessages([]);
        markAsRead(convo.roomId);
        setView('room');
        if (socket.current) socket.current.emit('join_room', convo.roomId);
    };

    const hasUnreadMessages = conversations.some(c => c.unread);

    return (
        <ChatContext.Provider value={{ 
            isOpen, toggleChat, view, goToList, goToRoom,
            activeChat, messages, sendMessage, user, conversations, deleteConversation, startChat, hasUnreadMessages
        }}>
            {children}
        </ChatContext.Provider>
    );
};