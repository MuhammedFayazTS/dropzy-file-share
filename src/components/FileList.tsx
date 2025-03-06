import { FC } from 'react'
import { Button } from './ui/button'
import { Send, X } from 'lucide-react';
import FilePreview from './FilePreview';

interface FileListProps {
    isSender: boolean;
    multiple?: boolean;
    files?: File[];
    removeSingleFile: (file: File) => void;
    removeFile: () => void;
    onSendFile: (file: File | File[]) => void;
}

const FileList: FC<FileListProps> = ({ isSender, multiple, files, removeSingleFile, removeFile, onSendFile }) => {
    return (
        <>
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
                                <Button variant="default" onClick={()=>onSendFile(multiple ? files : files[0])}>
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
        </>
    )
}

export default FileList