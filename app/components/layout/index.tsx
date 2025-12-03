
import { Outlet } from "react-router";
import NavBar from "./navbar";
import BG from "./bg";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen ">
            <BG />
            <NavBar></NavBar>

            <main className="mt-20 md:mt-10 px-4">
                <Outlet />
            </main>

        </div>
    );
}
