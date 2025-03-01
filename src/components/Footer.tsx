import { Link } from "react-router";

export default function Footer() {
    return (
        <footer className="p-4">
            <nav className="flex justify-center gap-4">
                <Link to="/about"><span className="text-neutral-500 hover:text-sky-400
                ">About</span></Link>
                <Link to="/privacy-policy"><span className="text-neutral-500 hover:text-sky-400
                ">Privacy Policy</span></Link>
                <Link to="/terms-of-service"><span className="text-neutral-500 hover:text-sky-400
                ">Terms of Service</span></Link>
            </nav>
        </footer>
    );
}
