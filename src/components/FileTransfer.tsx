import { useState } from "react";
import { useSocketStore } from "@/store/useSocketStore";
import FileUploader from "./FileUpload";
import FileList from "./FileList";
import { Loader } from "lucide-react";
import clsx from "clsx";

interface FileTransferProps {
    isSender: boolean;
    roomId: string;
    multiple?: boolean;
}

export default function FileTransfer({ multiple = false, isSender, roomId }: FileTransferProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [connected, setConnected] = useState(true);
    const { socket } = useSocketStore()

    const removeFile = () => {
        setFiles([]);
    };

    const removeSingleFile = (file: File) => {
        setFiles(files.filter(f => f.name !== file.name));
    };

    return !connected ? (
        <div className="w-full h-full flex justify-center items-center">
            <Loader className="animate-spin mr-3" />
            Connecting peers...
        </div>
    ) : (
        <div className={clsx("w-full h-full",
            isSender && "grid grid-flow-row md:grid-flow-col md:grid-cols-12 space-x-4"
        )}>
            {isSender && <FileUploader files={files} setFiles={setFiles} />}
            < FileList
                isSender={isSender}
                files={files}
                multiple={multiple}
                removeFile={removeFile}
                removeSingleFile={removeSingleFile}
                onSendFile={() => console.log()
                }
            />
        </div >
    )
}