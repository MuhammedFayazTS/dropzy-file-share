import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { OpenJoinRoomAlert } from "../../@types/types";

interface ConfirmJoinRoomProps {
    openJoinRoomAlert: OpenJoinRoomAlert,
    onClose: () => void;
}

export function ConfirmJoinRoom({ openJoinRoomAlert, onClose }: ConfirmJoinRoomProps) {
    return (
        <AlertDialog open={openJoinRoomAlert.open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Do you want to join the room?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will redirect you to the room created by {openJoinRoomAlert?.requestUser?.fullName}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={openJoinRoomAlert?.onConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
