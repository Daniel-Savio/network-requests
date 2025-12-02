import { Box, Home, Newspaper } from "lucide-react";
import { Link } from "react-router";
import { useLocation } from "react-router";


export default function NavBar() {
    const currentPath = useLocation()

    return (


        <header className="fixed top-0 md:relative flex w-full justify-center items-center ">
            <div className="p-2 mt-2 flex w-fit px-4 justify-around items-centerh-full  bg-white/30 backdrop-blur-sm bg-clip-padding backdrop-filter  bg-opacity-20 border border-gray-100 shadow-md text-secondary-foreground rounded-full">
                <nav>
                    <ul className="flex justify-around items-center space-x-4">
                        <li>
                            <Link
                                to="/"
                                className=" flex flex-col items-center text-secondary-foreground hover:opacity-75 transition-all"

                            >
                                <Home className="h-5 w-5" />
                                <span className="text-xs">Home</span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/"
                                className="flex flex-col items-center text-secondary-foreground hover:opacity-75 transition-all"
                            >
                                <Newspaper className="h-5 w-5" />
                                <span className="text-xs">Requisição</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/"
                                className="flex flex-col items-center text-secondary-foreground hover:opacity-75 transition-all"
                            >
                                <Box className="h-5 w-5" />
                                <span className="text-xs">Novo IED</span>
                            </Link>
                        </li>

                    </ul>
                </nav>
            </div>
        </header>

    )

}