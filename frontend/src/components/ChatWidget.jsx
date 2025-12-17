import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaTimes, FaUserCircle, FaCommentDots, FaArrowLeft, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { useChat } from '../context/ChatContext';
import ConfirmModal from './ConfirmModal';
import '../styles/ChatWidget.css';

export default function ChatWidget() {
    const { 
        isOpen, toggleChat, view, goToList, goToRoom,
        activeChat, messages, sendMessage, user, conversations, deleteConversation, hasUnreadMessages
    } = useChat();
    
    const [currentMessage, setCurrentMessage] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, view, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (currentMessage.trim()) {
            sendMessage(currentMessage);
            setCurrentMessage('');
        }
    };

    if (!user) return null;

    return (
        <>
            <button className={`chat-bubble-trigger ${isOpen ? 'hide' : ''}`} onClick={toggleChat}>
                <FaCommentDots />
                {hasUnreadMessages && <span className="notification-dot"></span>}
            </button>

            <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
                
                {view === 'list' && (
                    <div className="chat-view-list">
                        <div className="chat-header">
                            <h3>Pesan Masuk</h3>
                            <button onClick={toggleChat} className="chat-close-btn"><FaTimes /></button>
                        </div>
                        <div className="chat-search">
                            <FaSearch />
                            <input type="text" placeholder="Cari pesan..." />
                        </div>
                        <div className="chat-list-body">
                            {conversations.length === 0 ? (
                                <div className="chat-empty-state">
                                    <p>Belum ada percakapan.</p>
                                </div>
                            ) : (
                                conversations.map((convo) => (
                                    <div key={convo.roomId} className="chat-list-item" onClick={() => goToRoom(convo)}>
                                        <div className="chat-item-avatar">
                                            <FaUserCircle />
                                        </div>
                                        <div className="chat-item-info">
                                            <div className="chat-item-top">
                                                <span className={`chat-item-name ${convo.unread ? 'unread' : ''}`}>
                                                    {convo.participantName}
                                                </span>
                                                <span className="chat-item-time">{convo.time}</span>
                                            </div>
                                            <p className={`chat-item-preview ${convo.unread ? 'unread-text' : ''}`}>
                                                {convo.lastMessage}
                                            </p>
                                        </div>
                                        {convo.unread && <div className="chat-unread-badge"></div>}
                                        <button 
                                            className="btn-delete-chat"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteId(convo.roomId);
                                            }}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {view === 'room' && activeChat && (
                    <div className="chat-view-room">
                        <div className="chat-header">
                            <button onClick={goToList} className="chat-back-btn"><FaArrowLeft /></button>
                            <div className="chat-user-info">
                                <FaUserCircle className="chat-avatar" />
                                <div>
                                    <span className="chat-username">{activeChat.username || activeChat.reporter_name}</span>
                                    <span className="chat-status">Online</span>
                                </div>
                            </div>
                            <button onClick={toggleChat} className="chat-close-btn"><FaTimes /></button>
                        </div>

                        <div className="chat-body">
                            {messages.length === 0 && (
                                <div className="chat-intro">
                                    <p>Mulai mengobrol dengan aman.</p>
                                </div>
                            )}
                            {messages.map((msg, index) => {
                                const isMe = String(msg.authorId) === String(user.id);
                                return (
                                    <div key={index} className={`message-row ${isMe ? 'my-message' : 'other-message'}`}>
                                        <div className="message-bubble">
                                            <p className="message-text">{msg.message}</p>
                                            <span className="message-time">{msg.time}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} className="chat-footer">
                            <input
                                type="text"
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                placeholder="Tulis pesan..."
                                className="chat-input"
                            />
                            <button type="submit" className="chat-send-btn">
                                <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <ConfirmModal 
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => {
                    deleteConversation(deleteId);
                    setDeleteId(null);
                }}
                title="Hapus Percakapan?"
                message="Riwayat chat ini akan dihapus dari daftar Anda."
                confirmText="Hapus"
                isDanger={true}
                icon={<FaTrashAlt />}
            />
        </>
    );
}