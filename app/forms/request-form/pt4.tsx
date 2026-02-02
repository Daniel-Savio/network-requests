import { Button } from "@/components/ui/button"
import { useRequestStore } from "./store";

interface Props {
    isHidden: boolean
    next?: () => void
    prev?: () => void

}
export default function Pt4({ isHidden, next, prev }: Props) {
    const storedFormData = useRequestStore((state) => state);

    
    return (
        <div className="p-2 gap-2" style={isHidden ? { display: "none" } : {}}>
            <h1>Parte 4</h1>
            <pre>
                {JSON.stringify(storedFormData, null, 2)}
            </pre>

            {prev ? <Button onClick={prev}>prev</Button> : <Button className="invisible"></Button>}
            {next ? <Button onClick={next}>next</Button> : <Button className="invisible"></Button>}

        </div>
    )

}