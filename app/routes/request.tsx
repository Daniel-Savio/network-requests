import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import P1 from "@/forms/request-form/pt1"
import P2 from "@/forms/request-form/pt2"
import P3 from "@/forms/request-form/pt3"
import P4 from "@/forms/request-form/pt4"
import { useRequestStore } from "@/forms/request-form/store"
import { ChevronLast } from "lucide-react"
import { useState } from "react"


export default function Request() {
    const [formStep, setFormStep] = useState(0)
    const storedFormData = useRequestStore((state)=>state)

    const formData = storedFormData.saidas?.length ? storedFormData : ""

    function goToFinalStep(){
        setFormStep(3)
    }

    return (

        <div className="max-h-screen">
            <ScrollArea >
                <Card >
                    <CardHeader>
                        <h1 className="text-lg font-bold">Requisição</h1>
                        <div className="flex justify-between">
                            <h1>Progresso do formulário</h1>
                            {storedFormData.saidas  && <Button type="button" onClick={()=>{goToFinalStep()}}>Final <ChevronLast /></Button> }
                            
                        </div>
                        <Progress value={(formStep + 1) * 25}/>
                    </CardHeader>
                    <CardContent className="p-2">

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