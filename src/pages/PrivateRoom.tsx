import FileTransfer from "@/components/FileTransfer"
import RoomUsers from "@/components/RoomUsers"
import { useSocketStore } from "@/store/useSocketStore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { User } from "../../@types/types"

const PrivateRoom = () => {
    const navigate = useNavigate()
    const { socket } = useSocketStore()
    const roomId = useParams()?.roomId as unknown as string
    const mode = useParams()?.mode as unknown as string
    const [users, setUsers] = useState<User[]>([])

    if (!roomId || !mode) navigate("/")

    useEffect(() => {
        if (!socket) return
        if (!roomId || !mode) navigate("/")

        socket.emit("join room", roomId)

        const handleRoomFullError = (message: string, description?: string) => {
            toast.error(message || "Room is full!!", {
                description,
                closeButton: true,
                style: {
                    background: 'red',
                },
            });
        }

        socket.on("user joined", (value) => setUsers(value))

        socket.on("room full", () => {
            handleRoomFullError("Room is full", "Room limit reached!");
            navigate("/");
        });

        return () => {
            socket.off("user joined", (value) => setUsers(value))
        }
    }, [mode, navigate, roomId, socket])

    return (
        <main className="w-full h-[calc(100vh-136px)] flex justify-center">
            <div className="w-11/12 h-full flex flex-col">
                <div className="w-full flex-1 my-3">
                    <FileTransfer isSender={mode === "sender"} roomId={roomId} users={users} />
                </div>
                <RoomUsers roomId={roomId} type={mode} users={users} />
            </div>
        </main>
    )
}

export default PrivateRoom