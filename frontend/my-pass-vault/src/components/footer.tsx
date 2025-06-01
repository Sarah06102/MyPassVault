import { FaArrowUp } from "react-icons/fa";

export const Footer = () => {
    return(
        <footer className="py-4 px-8 relative border-t border-border mt-12 pt-2 flex flex-wrap justify-between items-center">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} MyPassVault.co All rights reserved.</p>
            <a href="#" className="p-2 rounded-full bg-violet-500/40 hover:bg-violet-600/20 text-violet-600 transition-colors"><FaArrowUp /></a>
        </footer>
    )
}