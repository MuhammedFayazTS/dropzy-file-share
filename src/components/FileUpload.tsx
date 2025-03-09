import { UploadCloud } from 'lucide-react';
import { useCallback, SetStateAction, Dispatch } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
    multiple?: boolean;
    accept?: Record<string, string[]>;
    files?: File[];
    setFiles: Dispatch<SetStateAction<File[]>>;
}

const FileUploader: React.FC<FileUploaderProps> = ({ multiple = false, accept = {}, setFiles }) => {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(multiple ? (prev) => [...prev, ...acceptedFiles] : [acceptedFiles[0]]);
    }, [multiple]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple,
        accept: Object.keys(accept).length > 0 ? accept : undefined,
    });

    return (
        <div
            {...getRootProps()}
            className=" w-full h-full md:col-span-6 flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition"
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p className="text-gray-600">Drop the files here...</p>
            ) : (
                <div className="flex flex-col items-center">
                    <UploadCloud className="w-10 h-10 text-gray-500 mb-2" />
                    <p className="text-gray-600">Drag & drop files here or click to upload</p>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
