import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Send, X } from 'lucide-react';
import FilePreview from './FilePreview';
import { useSocketStore } from '@/store/useSocketStore';
import { User } from '../../@types/types';
import { default as Peer } from "simple-peer";
import FileUploader from './FileUpload';

interface FileSenderProps {
    isSender: boolean;
    roomId: string;
    users?: User[];
    multiple?: boolean;
    setConnected: Dispatch<SetStateAction<boolean>>
}

const FileSender: FC<FileSenderProps> = ({ isSender, multiple, users, roomId, setConnected }) => {
    const peerRef = useRef<Peer.Instance | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const { socket } = useSocketStore()

    const removeFile = () => {
        setFiles([]);
    };

    const removeSingleFile = (file: File) => {
        setFiles(files.filter(f => f.name !== file.name));
    };

    // Sender
    useEffect(() => {
        if (!socket || peerRef.current || !users || users.length < 2) return;

        console.log("Initializing Sender Peer...");

        const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            },
        });

        peer.on("signal", (signal) => {
            console.log("Sender emitting signal:", signal);
            if (peer.destroyed) return console.warn("Sender: Cannot signal, peer is destroyed.");
            socket.emit("signal", { roomId, signal });
        });

        peer.on("connect", () => {
            console.log("Sender: Connected to peer!");
            setConnected(true);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleSignal = (signal: any) => {
            if (!peer || peer.destroyed) return console.warn("Sender: Peer is destroyed.");

            // Ensure we only accept "answer" type signals
            if (signal.type === "offer") {
                console.warn("Sender: Received unexpected offer, ignoring.");
                return;
            }

            console.log("Sender received signal:", signal);
            peer.signal(signal);
        };

        socket.on("signal", handleSignal);

        peerRef.current = peer;

        return () => {
            console.log("Sender: Cleaning up peer...");
            peer.destroy();
            peerRef.current = null;
            socket.off("signal", handleSignal);
        };
    }, [roomId, setConnected, socket, users]);

    // send file
    const handleSendFiles = async (file: File) => {
        if (!peerRef.current || !peerRef.current.connected) {
            console.error("Peer not connected");
            return;
        }

        const chunkSize = 16 * 1024; // 16 KB
        const buffer = await file.arrayBuffer();
        const totalChunks = Math.ceil(buffer.byteLength / chunkSize);

        // **Send metadata as a string**
        const metadata = JSON.stringify({
            type: "metadata",
            fileName: file.name,
            fileType: file.type,
            totalChunks: totalChunks,
        });

        peerRef.current.send(metadata); // String data is automatically encoded as text

        // **Send file chunks**
        for (let i = 0; i < totalChunks; i++) {
            const chunk = buffer.slice(i * chunkSize, (i + 1) * chunkSize);
            peerRef.current.send(chunk);
        }

        // **Send end signal as a string**
        peerRef.current.send(JSON.stringify({ type: "done" }));
    };

    return (
        <div className={"w-full h-full grid grid-flow-row md:grid-flow-col md:grid-cols-12 gap-y-4 md:gap-y-0 md:space-x-4"
        }>
            <FileUploader files={files} setFiles={setFiles} />
            {
                files && files.length > 0 ? (
                    <div className="space-y-2 md:col-span-6 md:h-full flex flex-col justify-center items-center  border rounded-lg ">
                        <div className='md:h-5/6 w-full p-5'>
                            {multiple ? (
                                files.map((file) => (
                                    <div key={file.name} className="w-full flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:border-neutral-500">
                                        <span className="text-sm text-gray-700 hover:text-neutral-500">{file.name}</span>
                                        <Button variant="ghost" size="icon" onClick={() => removeSingleFile(file)}>
                                            <X className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <FilePreview file={files[0]} />
                            )}
                        </div>

                        {isSender && (
                            <div className="flex space-x-2 mt-2">
                                <Button variant="default" onClick={() => handleSendFiles(files[0])}>
                                    Send
                                    <Send className="w-4 h-4 text-blue-500" />
                                </Button>
                                <Button variant="destructive" onClick={removeFile}>
                                    Remove
                                    <X className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="md:col-span-6 md:h-full flex justify-center items-center text-neutral-500 border border-gray-500 rounded-lg">
                        No File Selected
                    </div>
                )
            }
        </div>
    )
}

export default FileSender