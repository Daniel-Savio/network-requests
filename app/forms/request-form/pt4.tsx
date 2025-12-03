import { Button } from "@/components/ui/button"

interface Props {
    isHidden: boolean
    next?: () => void
    prev?: () => void

}
export default function Pt4({ isHidden, next, prev }: Props) {

    return (
        <div className="p-2 gap-2" style={isHidden ? { display: "none" } : {}}>
            <h1>Parte 4</h1>
            {prev ? <Button onClick={prev}>prev</Button> : <Button className="invisible"></Button>}
            {next ? <Button onClick={next}>next</Button> : <Button className="invisible"></Button>}

        </div>
    )

}