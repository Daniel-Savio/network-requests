import { Controller, useFieldArray } from "react-hook-form";
import ied from "@/lib/ieds-info.json";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { motion } from "motion/react";



export const IedArray = ({ nestIndex, control, setValue }: { nestIndex: number, control: any, setValue: any }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `entradas.${nestIndex}.ieds`
    });
    const bouncingUpAnimation = {
        initial: { y: 10, opacity: 0 },
        whileInView: { y: 0, opacity: 1 },
        transition: {
            duration: 0.3,
            delay: 0.3,
            type: "spring" as const,
            stiffness: 200
        }
    }

    const allIeds = [...ied.ied, ...ied.ied_terceiros];

    return (
        <div className="p-1">
            <h3 className="font-semibold  mb-2">IEDs</h3>


            {fields.map((item, k) => (
                <motion.div key={item.id} className="flex flex-col gap-2 mt-2  border rounded-md" initial={bouncingUpAnimation.initial} whileInView={bouncingUpAnimation.whileInView} transition={{ ...bouncingUpAnimation.transition, delay: parseFloat(`${k * 0.1} `) }}>
                    <div className="flex items-center gap-2">
                        <Controller
                            name={`entradas.${nestIndex}.ieds.${k}.name`}
                            control={control}
                            render={({ field }) => (
                                <div className="w-full flex justify-between bg-zinc-200 border-b-2 shadow-2xs">
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            const selectedIed = allIeds.find(ied => ied.nome === value);
                                            if (selectedIed) {
                                                setValue(`entradas.${nestIndex}.ieds.${k}.manufacturer`, selectedIed.fabricante);
                                            }
                                        }}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full rounded-none border-0">
                                            <SelectValue placeholder="Selecione um IED" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allIeds.map((ied, i) => (
                                                <SelectItem key={i} value={ied.nome}>{ied.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div >
                                        <Button type="button" variant="outline" className="bg-linear-to-r from-zinc-200 to-red-200 hover:bg-red-200 " onClick={() => remove(k)}>
                                            <X className="size-3 text-red-700" />
                                        </Button>
                                    </div>
                                </div>

                            )}
                        />


                    </div>
                    <div className="flex items-center gap-2">
                        <Controller
                            name={`entradas.${nestIndex}.ieds.${k}.address`}
                            control={control}
                            render={({ field }) => <InputGroup className="w-full"><InputGroupInput className="w-full" type="number" placeholder="Endereço" {...field} /></InputGroup>}
                        />
                        <Controller
                            name={`entradas.${nestIndex}.ieds.${k}.modules`}
                            control={control}
                            render={({ field }) => <InputGroup className="w-full"><InputGroupInput className="w-full" type="number" placeholder="Módulos" {...field} /></InputGroup>}
                        />
                    </div>
                    <div>
                        <Controller
                            name={`entradas.${nestIndex}.ieds.${k}.optional`}
                            control={control}
                            render={({ field }) => <InputGroupInput placeholder="Opcional" {...field} />}
                        />
                    </div>
                </motion.div>
            ))}


            <Button
                type="button"
                variant="outline"
                className="mt-2 w-full"
                onClick={() => append({ name: "", manufacturer: "", address: "", modules: "", optional: "" })}
            >
                <Plus className="size-4 mr-2" /> Adicionar IED
            </Button>
        </div>
    );
};