import { useEffect, useState } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import clsx from "clsx";
import { OpenJoinRoomAlert, User } from "../../@types/types";
import { getPlatformLogo } from "@/lib/utils";
import { ConfirmJoinRoom } from "./ConfirmJoinRoom";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export default function UserList() {
    const navigate = useNavigate()
    const { socket } = useSocketStore();
    const [users, setUsers] = useState<User[]>([]);
    const [isSameNetwork, setIsSameNetwork] = useState(true)
    const [openJoinRoomAlert, setOpenJoinRoomAlert] = useState<OpenJoinRoomAlert>({
        open: false,
        onConfirm: () => { }
    });

    const handleShowSameNetworkMembers = () => {
        setIsSameNetwork(prev => !prev)
    };

    useEffect(() => {

        const handleJoinedUsers = (users: User[]) => {
            const withoutCurrentUser = users.filter(user => user.id !== socket?.id)
            setUsers(withoutCurrentUser)
        }

        const handlePrivateRoomConfirmation = (roomId: string, requestUser: User) => {
            if (!socket) return
            setOpenJoinRoomAlert({
                open: true,
                requestUser,
                onConfirm: () => {
                    socket.emit("accept request", requestUser.id, roomId)
                    navigate("/private/" + roomId + "/receiver")
                }
            })
        };

        const handleAcceptRoomRequest = (roomId: string) => {
            toast(`Joining room : ${roomId}`, {
                duration: 500,
                closeButton: true,
            })
            navigate("/private/" + roomId + "/sender")
        }

        const handleErrorEvents = (message: string, description?: string) => {
            toast.error(message || "Error in connection!!", {
                description,
                closeButton: true,
                style: {
                    background: 'red',
                },
            });
        }

        socket?.on("user joined", (value) => handleJoinedUsers(value))

        socket?.on("error", (message, description) => handleErrorEvents(message, description))

        socket?.on("user accepted request", (roomId) => handleAcceptRoomRequest(roomId))

        socket?.on("request to join room", (roomId, requestUserId) => handlePrivateRoomConfirmation(roomId, requestUserId))

        return () => {
            socket?.off("user")
        }
    }, [socket])

    const handleJoinRoom = (receiverId: string) => {
        if (!socket?.id) return
        const sender = socket.id
        const roomId = `room-${sender}-${receiverId}`
        socket.emit('request join room', roomId, receiverId)
        toast(`Wait for the receiver to accept room request`, {
            duration: 2000,
            icon: <Loader className="animate-spin mr-2 w-4 h-4" />,
            closeButton: true,
        })
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center relative">
            <div className="relative w-11/12 h-5/6 p-10 overflow-hidden">
                {users?.map((user) => (
                    <button
                        key={user.id}
                        style={user.position}
                        onClick={() => handleJoinRoom(user.id)}
                        className="absolute z-10 text-gray-900 dark:text-white flex flex-col items-center justify-center"
                    >
                        <div
                            className={`relative w-14 h-14 rounded-full animate-bounce overflow-hidden p-3 ${user.color}`}>
                            <img
                                className="w-full h-full aspect-square"
                                src={getPlatformLogo(user.userAgent)}
                                alt={user.fullName}
                            />
                        </div>
                        <span className="animate-bounce sm:text-sm md:text-base">{user?.fullName}</span>
                    </button>
                ))}
            </div>


            <h2 className="text-xl font-semibold mb-2">Online Users</h2>

            <button className={
                clsx(
                    "border rounded-lg px-3 py-2 z-10",
                    !isSameNetwork ? "bg-green-500/20 border-green-500/30" : "bg-amber-500/20 border-amber-500/30"
                )
            } type="button" onClick={handleShowSameNetworkMembers}>{isSameNetwork ? 'All' : 'Same'} Newtork</button>

            <div
                className={clsx(
                    "absolute -z-0 inset-0 h-full w-full bg-[size:20px_20px]",
                    isSameNetwork
                        ? "bg-[linear-gradient(to_right,#22c55e40_1px,transparent_1px),linear-gradient(to_bottom,#22c55e40_1px,transparent_1px)]"
                        : "bg-[linear-gradient(to_right,#73737320_1px,transparent_1px),linear-gradient(to_bottom,#73737320_1px,transparent_1px)]",
                    "[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_80%,transparent_100%)]"
                )}
            />

            <ConfirmJoinRoom openJoinRoomAlert={openJoinRoomAlert} onClose={() => setOpenJoinRoomAlert({ open: false })} />
        </div>
    );
}
