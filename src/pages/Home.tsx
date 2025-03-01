import { useEffect } from 'react'
import { useSocketStore } from '@/store/useSocketStore';
import UserList from '@/components/userList';

const Home = () => {
    const { socket, pubIp } = useSocketStore()
    console.log({ pubIp })
    useEffect(() => {
        if (!socket || !pubIp) return;
        socket?.emit("join room", pubIp);
        socket?.on("all users", (value) => console.log(value))
        return () => {
            socket?.off("user")
        }
    }, [socket, pubIp])
    return (
        <main className='w-full h-full'>
            <UserList />
        </main>
    )
}

export default Home