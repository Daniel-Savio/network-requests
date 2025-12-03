import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import P1 from "@/forms/request-form/pt1"
import P2 from "@/forms/request-form/pt2"
import P3 from "@/forms/request-form/pt3"
import P4 from "@/forms/request-form/pt4"
import { useState } from "react"


export default function Request() {
    const [formStep, setFormStep] = useState(0)


    return (

        <div className="max-h-screen">
            <ScrollArea >
                <Card>
                    <CardHeader>
                        <h1 className="text-lg font-bold">Requisição</h1>
                        <h2>Progresso do formulário</h2>
                        <Progress value={(formStep + 1) * 25}></Progress>
                    </CardHeader>
                    <CardContent>

                        <P1 isHidden={formStep !== 0} next={() => { setFormStep(1) }} />
                        <P2 isHidden={formStep !== 1} next={() => { setFormStep(2) }} prev={() => { setFormStep(0) }} />
                        <P3 isHidden={formStep !== 2} next={() => { setFormStep(3) }} prev={() => { setFormStep(1) }} />
                        <P4 isHidden={formStep !== 3} prev={() => { setFormStep(2) }} />
                    </CardContent>
                </Card>
            </ScrollArea>
        </div>


    )

}