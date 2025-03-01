import { Link } from "react-router";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
    return (
        <header className="p-4 w-full">
            <nav className="flex gap-4 justify-center">
                <Link to="/">
                    <div className="flex flex-col items-center text-neutral-900 dark:text-white ">
                        <span className="text-xl font-black md:font-bold">Dropzy</span>
                        <span className="text-sm font-normal">
                            Drop Easy - File Sharing
                        </span>
                    </div>
                </Link>
            </nav>
            <div className="fixed top-5 right-5"><ModeToggle /></div>
        </header>
    );
}
