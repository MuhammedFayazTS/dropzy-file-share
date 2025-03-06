import { FC, useEffect, useState } from 'react'
import { User } from '../../@types/types';
import { useSocketStore } from '@/store/useSocketStore';
import { ArrowRight } from 'lucide-react';

interface RoomUsersProps {
    type?: string;
    roomId?: string;
    users?: User[]
}

const RoomUsers: FC<RoomUsersProps> = ({ type, roomId, users }) => {
    const { socket } = useSocketStore();
    const [sender, setSender] = useState<User | null>(null);
    const [receiver, setReceiver] = useState<User | null>(null);

    useEffect(() => {
        if (!socket || !users || !users?.length) return;

        const handleJoinedUsers = (users: User[]) => {
            const isSender = type === 'sender'
            const senderUser = users.find(s => isSender ? s.id === socket.id : s.id !== socket.id)
            const receiverUser = users.find(s => isSender ? s.id !== socket.id : s.id === socket.id)
            if (senderUser) setSender(senderUser);
            if (receiverUser) setReceiver(receiverUser);
        }

        handleJoinedUsers(users)

        return () => {
        };
    }, [socket, type, users]);

    if (!type || !roomId || (!receiver && !sender)) return <div className='w-full text-center'><span className='text-red-500'>No users found</span></div>

    return (
        <div className="md:mt-auto self-center w-fit flex space-x-2">
            <div className="w-full flex items-center justify-between p-4 border-b">
                {sender && (
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <img src={sender.image} width={40} height={40} className="rounded-full" alt={sender.fullName} />
                        <span className="text-lg font-medium">{sender.fullName} {type === 'sender' && '(You)'}</span>
                    </div>
                )}
                {
                    sender && receiver && (
                        <div className="flex flex-col items-center">
                            <div className="relative w-full h-6 overflow-hidden flex space-x-2">
                                <ArrowRight className="w-10 h-6 text-blue-500 animate-move-right" strokeWidth={3} />
                            </div>
                        </div>
                    )
                }
                {receiver && (
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <img src={receiver.image} width={40} height={40} className="rounded-full" alt={receiver.fullName} />
                        <span className="text-lg font-medium">{receiver.fullName} {type === 'receiver' && '(You)'}</span>
                    </div>
                )}
            </div>

        </div>
    )
}

export default RoomUsers