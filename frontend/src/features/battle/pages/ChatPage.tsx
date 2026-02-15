import React, { useState, useRef, useEffect } from 'react';
import { CHAT_ROOMS, MOCK_MESSAGES } from '../data/battle.data';
import type { ChatMessage, ChatRoom } from '../data/battle.data';

interface ChatPageProps {
    userName: string;
    onBack: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ userName, onBack }) => {
    const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;
        const newMsg: ChatMessage = {
            id: `msg_${Date.now()}`, senderId: 'me', senderName: userName || 'You',
            senderAvatar: '🧑', text: input.trim(),
            timestamp: new Date(), isCurrentUser: true,
        };
        setMessages(prev => [...prev, newMsg]);
        setInput('');

        // Simulate reply after 1-2 seconds
        setTimeout(() => {
            const replies = [
                'Great point! 💡', 'Keep going, you got this! 💪', 'I had the same question!',
                'That section was tricky for me too 😅', 'Good luck in your exam! 🍀',
                'Has anyone tried the flashcard method?', 'Day 15 was a game changer 🔥',
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const avatars = ['👩‍⚕️', '👨‍⚕️', '💊'];
            const names = ['Sara', 'Omar', 'Fatima', 'Ahmed', 'Khalid'];
            setMessages(prev => [...prev, {
                id: `reply_${Date.now()}`,
                senderId: `o${Math.floor(Math.random() * 6)}`,
                senderName: names[Math.floor(Math.random() * names.length)],
                senderAvatar: avatars[Math.floor(Math.random() * avatars.length)],
                text: randomReply,
                timestamp: new Date(),
                isCurrentUser: false,
            }]);
        }, 1000 + Math.random() * 2000);
    };

    const formatTime = (d: Date) => {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // ─── ROOM LIST ───
    if (!activeRoom) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#f8fafc',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                color: '#1e293b', padding: '1.5rem',
            }}>
                <div style={{ maxWidth: '520px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.5rem' }}>←</button>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a' }}>💬 Community</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {CHAT_ROOMS.map(room => (
                            <button key={room.id} onClick={() => setActiveRoom(room)} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '1rem', borderRadius: '0.75rem',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                cursor: 'pointer', color: '#1e293b', textAlign: 'left', width: '100%',
                                transition: 'all 0.2s',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>{room.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.15rem' }}>{room.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {room.lastMessage}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    {room.unreadCount > 0 && (
                                        <div style={{
                                            width: '20px', height: '20px', borderRadius: '50%', background: '#2563eb',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.65rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem', marginLeft: 'auto',
                                        }}>{room.unreadCount}</div>
                                    )}
                                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{room.memberCount} members</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ─── CHAT VIEW ───
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            background: '#f8fafc',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: '#1e293b',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '1rem 1.5rem',
                background: '#ffffff', borderBottom: '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}>
                <button onClick={() => setActiveRoom(null)} style={{
                    background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.25rem',
                }}>←</button>
                <span style={{ fontSize: '1.25rem' }}>{activeRoom.icon}</span>
                <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>{activeRoom.name}</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{activeRoom.memberCount} members</div>
                </div>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1, overflow: 'auto', padding: '1rem 1.5rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
            }}>
                {messages.map(msg => (
                    <div key={msg.id} style={{
                        display: 'flex',
                        flexDirection: msg.isCurrentUser ? 'row-reverse' : 'row',
                        gap: '0.5rem',
                        alignItems: 'flex-end',
                    }}>
                        {!msg.isCurrentUser && (
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: '#e2e8f0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1rem', flexShrink: 0,
                            }}>{msg.senderAvatar}</div>
                        )}
                        <div style={{ maxWidth: '75%' }}>
                            {!msg.isCurrentUser && (
                                <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.15rem', paddingLeft: '0.5rem' }}>
                                    {msg.senderName}
                                </div>
                            )}
                            <div style={{
                                padding: '0.6rem 0.9rem',
                                borderRadius: msg.isCurrentUser ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                                background: msg.isCurrentUser
                                    ? '#2563eb' // Blue for me
                                    : '#ffffff', // White for others
                                color: msg.isCurrentUser ? '#fff' : '#334155',
                                border: msg.isCurrentUser ? 'none' : '1px solid #e2e8f0',
                                fontSize: '0.9rem', lineHeight: 1.4,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            }}>
                                {msg.text}
                            </div>
                            <div style={{
                                fontSize: '0.6rem', color: '#94a3b8', marginTop: '0.15rem',
                                textAlign: msg.isCurrentUser ? 'right' : 'left',
                                paddingLeft: msg.isCurrentUser ? 0 : '0.5rem',
                                paddingRight: msg.isCurrentUser ? '0.5rem' : 0,
                            }}>{formatTime(msg.timestamp)}</div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
                padding: '0.75rem 1rem', background: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex', gap: '0.5rem',
            }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={{
                        flex: 1, padding: '0.7rem 1rem',
                        background: '#f8fafc', border: '1px solid #cbd5e1',
                        borderRadius: '1.5rem', color: '#1e293b', fontSize: '0.9rem', outline: 'none',
                    }}
                />
                <button onClick={sendMessage} style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: input.trim() ? '#2563eb' : '#e2e8f0',
                    border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', color: input.trim() ? '#fff' : '#94a3b8', transition: 'background 0.2s',
                }}>➤</button>
            </div>
        </div>
    );
};
