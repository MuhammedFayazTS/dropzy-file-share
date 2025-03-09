import { useSocketStore } from "@/store/useSocketStore";
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import { Progress } from "./ui/progress";
import { default as Peer } from "simple-peer";
import { Divide, Download } from "lucide-react";
import FilePreview from "./FilePreview"; // Import FilePreview
import { Button } from "./ui/button";

interface FileReceiverProps {
    roomId: string;
    setConnected: Dispatch<SetStateAction<boolean>>;
}

interface DownloadedFile {
    fileName: string;
    url: string;
    progress: number;
    fileBlob?: Blob;
    fileType?: string;
    isDownloaded?: boolean;
}

const FileReceiver: FC<FileReceiverProps> = ({ roomId, setConnected }) => {
    const peerRef = useRef<Peer.Instance | null>(null);
    const { socket } = useSocketStore();
    const [downloadedFiles, setDownloadedFiles] = useState<DownloadedFile[]>([]);
    const [previewFile, setPreviewFile] = useState<File | null>(null); // For file preview

    useEffect(() => {
        if (!socket || peerRef.current) return;

        console.log("Initializing Receiver Peer...");

        const peer = new Peer({
            initiator: false,
            trickle: false,
            config: {
                iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
            },
        });

        peer.on("signal", (signal) => {
            console.log("Receiver emitting signal:", signal);
            if (peer.destroyed) return console.warn("Receiver: Cannot signal, peer is destroyed.");
            socket.emit("signal", { roomId, signal });
        });

        peer.on("connect", () => {
            console.log("Receiver: Connected to peer!");
            setConnected(true);
        });

        const fileChunks: Record<string, ArrayBuffer[]> = {};
        const fileProgress: Record<string, { received: number; total: number }> = {};
        let receivedMetadata: any = null;

        const handleReceivingData = (data: any) => {
            if (data instanceof Uint8Array && data.length < 256) {
                try {
                    const decodedString = new TextDecoder().decode(data);
                    const message = JSON.parse(decodedString);

                    if (message.type === "metadata") {
                        receivedMetadata = message;
                        const { fileName, totalChunks, fileType } = message;

                        fileChunks[fileName] = [];
                        fileProgress[fileName] = { received: 0, total: totalChunks * 16 * 1024 };

                        setDownloadedFiles((prev) => [
                            ...prev,
                            { fileName, url: "", progress: 0, fileType }
                        ]);

                        return;
                    } else if (message.type === "done" && receivedMetadata) {
                        const { fileName, fileType } = receivedMetadata;

                        const fileBlob = new Blob(fileChunks[fileName], { type: fileType });
                        const downloadUrl = URL.createObjectURL(fileBlob);

                        setDownloadedFiles((prev) =>
                            prev.map((file) =>
                                file.fileName === fileName
                                    ? { ...file, url: downloadUrl, fileBlob, progress: 100, isDownloaded: false }
                                    : file
                            )
                        );

                        delete fileChunks[fileName];
                        delete fileProgress[fileName];

                        return;
                    }
                } catch (err) {
                    console.log("Decoding error:", err);
                }
            }

            if (receivedMetadata) {
                const { fileName } = receivedMetadata;

                fileChunks[fileName].push(data);
                fileProgress[fileName].received += data.length;

                const progress = Math.min(100, Math.round((fileProgress[fileName].received / fileProgress[fileName].total) * 100));

                setDownloadedFiles((prev) =>
                    prev.map((file) =>
                        file.fileName === fileName ? { ...file, progress } : file
                    )
                );
            }
        };

        peer.on("data", (data) => handleReceivingData(data));

        socket.on("signal", (signal: any) => {
            if (!peerRef.current || peerRef.current.destroyed) return;
            if (signal.type !== "answer") peerRef.current.signal(signal);
        });

        peerRef.current = peer;

        return () => {
            console.log("Receiver: Cleaning up peer...");
            peer.destroy();
            peerRef.current = null;
            socket.off("signal");
        };
    }, [roomId, socket]);

    const onClickDownload = (fileName: string, downloadUrl: string) => {
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Delay revoking the URL to avoid "no internet connection" issue
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

    // Update state to mark the file as downloaded
    setDownloadedFiles((prev) =>
        prev.map((file) =>
            file.fileName === fileName ? { ...file, isDownloaded: true } : file
        )
    );
};


    return (
        <div className="w-full h-full flex">
            <ul className="w-1/2 h-full overflow-y-scroll flex flex-col gap-y-2 p-2">
                {downloadedFiles.map((file, index) => (
                    <li key={index} className="pt-2 rounded border border-neutral-400 p-2">
                        <a
                            className="px-4 flex justify-between cursor-pointer"
                            onClick={() => {
                                if (file.fileBlob) {
                                    setPreviewFile(new File([file.fileBlob], file.fileName, { type: file.fileType }));
                                }
                            }}
                        >
                            <span className="text-neutral-400">{file.fileName}</span>
                            {!file.isDownloaded && (
                                <Download
                                    className="text-emerald-500 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering file preview
                                        onClickDownload(file.fileName, file.url);
                                    }}
                                />
                            )}
                        </a>
                        <Progress className="h-1 mt-2" value={file.progress} />
                    </li>
                ))}
            </ul>

            <div className="w-1/2 h-full border border-dashed border-neutral-600 p-5 flex flex-col items-center justify-center">
                {previewFile ? <FilePreview file={previewFile} /> : <span className="text-gray-500">Select a file to preview</span>}
                {previewFile && (
                    <Button
                        variant={"default"}
                        onClick={() => {
                            const downloadUrl = URL.createObjectURL(previewFile);
                            const a = document.createElement("a");
                            a.href = downloadUrl;
                            a.download = previewFile.name;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);

                            // Revoke the object URL after a short delay
                            setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
                        }}
                    >
                        Download {" "}
                        <Download />
                    </Button>
                )}

            </div>
        </div>
    );
};

export default FileReceiver;
