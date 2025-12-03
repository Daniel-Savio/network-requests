import { Button } from "@/components/ui/button"
import { requestFormSchema } from "./types"
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from "react-hook-form";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import info from "@/lib/request-info.json"
import { ChevronRight, CircleQuestionMark, Factory, FileDigit, FolderKanban, Hash, Search, Users } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import type z from "zod";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  isHidden: boolean
  next?: () => void
  prev?: () => void

}
const generalInfoSchema = requestFormSchema.pick({
  requester: true,
  email: true,
  departament: true,
  isEqual: true,
  client: true,
  project: true,
  invoiceNumber: true,
  clientNumber: true,
  gateway: true,
})
type GeneralInfo = z.infer<typeof generalInfoSchema>


export default function Pt1({ isHidden, next, prev }: Props) {

  const form = useForm<GeneralInfo>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
    }
  })

  function onSubmit(data: GeneralInfo) {
    console.log(data)
  }

  const requester = form.watch("requester")

  return (
    <div className="p-2 gap-2" style={isHidden ? { display: "none" } : {}}>
      <h1 className="text-lg font-bold">Informações Gerais</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* Requester */}
        <Controller control={form.control}
          name="requester"
          render={({ field }) => (
            <InputGroup className="flex gap-2 mb-2">
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um requerente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Requerente</SelectLabel>
                    {
                      info.requester.sort((a, b) => a.name.localeCompare(b.name)).map((item, index) => {
                        return (
                          <SelectItem key={index} value={item.name}>
                            {item.name}
                          </SelectItem>
                        )
                      })
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
              <InputGroupAddon align={"inline-start"}><Users /></InputGroupAddon>
              <InputGroupAddon className="w-full text-zinc-500" align="inline-end">{requester ? info.requester.find(item => item.name === requester)?.departament : <span className="text-zinc-500">Departamento</span>}</InputGroupAddon>

            </InputGroup>
          )}
        />

        {/* Projeto e Cliente */}
        <InputGroup>
          <InputGroupInput {...form.register("project")} placeholder="Nome do projeto">
          </InputGroupInput>
          <InputGroupAddon>
            <FolderKanban />
          </InputGroupAddon>
          <InputGroupAddon align={"inline-end"}>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton>
                  <CircleQuestionMark className="size-4" />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent className="max-w-40 text-justify">Coloque aqui um nome que remeta-se ao projeto sendo trabalhado ou até mesmo o nome da empresa ou cliente final do trabalho</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>

        <InputGroup>
          <InputGroupInput {...form.register("client")} placeholder="Cliente - Fábrica - Interno">
          </InputGroupInput>
          <InputGroupAddon>
            <Factory />
          </InputGroupAddon>
          <InputGroupAddon align={"inline-end"}>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton>
                  <CircleQuestionMark className="size-4" />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent className="max-w-40 text-justify">Coloque aqui o nome do cliente que receberá a aplicação ou "Interno" caso seja para a própria Treetech</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>

        {/* Número do Projeto e Número do Cliente */}

        <InputGroup className="mt-5">
          <InputGroupInput {...form.register("clientNumber")} placeholder="Número do cliente">
          </InputGroupInput>
          <InputGroupAddon>
            <Hash />
          </InputGroupAddon>
        </InputGroup>

        <InputGroup className="">
          <InputGroupInput {...form.register("invoiceNumber")} placeholder="Número do pedido">
          </InputGroupInput>
          <InputGroupAddon>
            <FileDigit />
          </InputGroupAddon>
        </InputGroup>

        <footer className="flex gap-1 justify-between mt-5">
          {prev ? <Button onClick={prev}>prev</Button> : <Button className="invisible"></Button>}
          {next ? <Button onClick={next}><ChevronRight /></Button> : <Button className="invisible"></Button>}
        </footer>
      </form>

    </div>
  )

}