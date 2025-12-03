import { Button } from "@/components/ui/button"

interface Props {
    isHidden: boolean
    next?: () => void
    prev?: () => void

}
export default function Pt2({ isHidden, next, prev }: Props) {

    return (
        <div className="p-2 gap-2" style={isHidden ? { display: "none" } : {}}>
            <h1 className="text-lg font-bold">Entradas</h1>

            <form>
                <footer className="flex gap-1 justify-between mt-5">
                    {prev ? <Button onClick={prev}>prev</Button> : <Button className="invisible"></Button>}
                    {next ? <Button onClick={next}>next</Button> : <Button className="invisible"></Button>}
                </footer>
            </form>

        </div>
    )

}