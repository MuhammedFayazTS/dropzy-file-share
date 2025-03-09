import { useState } from "react";
import FileSender from "./FileSender";
import { Loader } from "lucide-react";
import { User } from "../../@types/types";
import FileReceiver from "./FileReceiver";

interface FileTransferProps {
    isSender: boolean;
    roomId: string;
    multiple?: boolean;
    users?: User[]
}

export default function FileTransfer({ multiple = false, isSender, roomId, users }: FileTransferProps) {
    const [connected, setConnected] = useState(true);

    return !connected ? (
        <div className="w-full h-full flex justify-center items-center">
            <Loader className="animate-spin mr-3" />
            Connecting peers...
        </div>
    ) : (
        <div className="w-full h-full">

            {isSender && < FileSender
                isSender={isSender}
                multiple={multiple}
                users={users}
                roomId={roomId}
                setConnected={setConnected}
            />}

            {!isSender && (
                <FileReceiver
                    roomId={roomId}
                    setConnected={setConnected}
                />
            )}
        </div >
    )
}