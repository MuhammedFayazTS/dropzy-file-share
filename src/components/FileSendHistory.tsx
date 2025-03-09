import { FC } from "react";
import { Progress } from "./ui/progress";
import { X } from "lucide-react";

interface FileSendHistoryProps {
  history: { file: File; progress: number }[];
  removeHistory: (file: File) => void;
}

const FileSendHistory: FC<FileSendHistoryProps> = ({ history, removeHistory }) => {
  return (
    <div className="border p-3 rounded-md space-y-2">
      <h3 className="text-lg font-semibold">Send History</h3>
      {history.length === 0 ? (
        <p className="text-gray-500">No files sent yet.</p>
      ) : (
        history.map(({ file, progress }) => (
            <div className="flex flex-col rounded-md  border overflow-hidden">
          <div key={file.name} className="flex items-center justify-between p-2 ">
              <p className="text-sm font-medium">{file.name}</p>
            <button onClick={() => removeHistory(file)} className="text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
            <Progress value={progress} className="w-full mt-1 h-1" />
            </div>
        ))
      )}
    </div>
  );
};

export default FileSendHistory;
