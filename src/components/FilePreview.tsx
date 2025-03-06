import { formatBytes, getFileType } from "@/lib/utils";

interface FilePreviewProps {
    file: File;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
    const fileType = getFileType(file);
    const fileURL = URL.createObjectURL(file);
    const fileSize = formatBytes(file?.size)

    return (
        <div className="w-full h-full p-4 flex flex-col items-center justify-center space-y-2">
            {fileType === 'image' ? (
                <img
                    src={fileURL}
                    alt={file.name}
                    width={0}
                    height={0}
                    sizes="100%"
                    className="w-full aspect-video object-cover rounded-lg"
                />
            ) : fileType === 'application' && file.name.endsWith('.pdf') ? (
                <iframe src={fileURL} className="w-full h-full" title="PDF Preview"></iframe>
            ) : fileType === 'video' ? (
                <video controls className="w-full max-h-[100%] aspect-video rounded-lg">
                    <source src={fileURL} type={file.type} />
                    Your browser does not support the video tag.
                </video>
            ) : fileType === 'audio' ? (
                <audio controls className="w-full">
                    <source src={fileURL} type={file.type} />
                    Your browser does not support the audio element.
                </audio>
            ) : (
                <span className="text-sm text-gray-700">{file.name}</span>
            )}

            <span className='text-xl font-bold text-neutral-500'>{fileSize}</span>
        </div>
    );
};

export default FilePreview;
