import { Box, Home, Newspaper } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useLocation } from "react-router";
import * as motion from "motion/react-client"



export default function NavBar() {
    const currentPath = useLocation().pathname

    return (

        <header className="fixed top-0 md:relative flex w-full justify-center items-center ">
            <div className="p-2 mt-2 flex w-fit px-4 justify-around items-centerh-full  bg-white/30 backdrop-blur-sm bg-clip-padding backdrop-filter  bg-opacity-20 border border-gray-100 shadow-md text-secondary-foreground rounded-full">
                <nav>
                    <ul className="flex justify-around items-center space-x-4">
                        <motion.li>
                            <Link
                                to="/"
                                className=" flex flex-col items-center text-secondary-foreground hover:opacity-75 transition-all"
                                style={currentPath === "/" ? { color: "#008242" } : {}}
                            >
                                <Home className="h-5 w-5" />
                                <span className="text-xs hidden md:flex">Home</span>
                            </Link>
                        </motion.li>

                        <li>
                            <Link
                                to="/request"
                                className="flex flex-col items-center text-secondary-foreground hover:opacity-75 transition-all"
                                style={currentPath === "/request" ? { color: "#008242", transform: "translateY(-2px)" } : {}}
                            >
                                <Newspaper className="h-5 w-5" />
                                <span className="text-xs hidden md:flex">Requisição</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/new-ied"
                                className="flex flex-col items-center text-secondary-foreground hover:opacity-75 transition-all"

                                style={currentPath === "/new-ied" ? { color: "#008242", transform: "translateY(-2px)" } : {}}
                            >
                                <Box className="h-5 w-5" />
                                <span className="text-xs hidden md:flex">Novo IED</span>
                            </Link>
                        </li>

                    </ul>
                </nav>
            </div>
        </header>

    )

}