
import { Outlet } from "react-router";
import NavBar from "./navbar";
import BG from "./bg";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen ">
            <BG />
            <NavBar></NavBar>

            <main className="mt-24 md:mt-0 px-4">
                <Outlet />
            </main>

        </div>
    );
}
