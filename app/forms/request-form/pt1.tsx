import { Button } from "@/components/ui/button"
import { requestFormSchema } from "./types"
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from "react-hook-form";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import info from "@/lib/request-info.json"
import SDG from "/SDg.png"
import SDP from "/SDp.png"
import { ChevronRight, CircleQuestionMark, Factory, FileDigit, FolderKanban, Hash, Sigma, Users, X } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import type z from "zod";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import InputError from "@/components/error";


interface Props {
  isHidden: boolean
  next?: () => void
  prev?: () => void

}
const generalInfoSchema = requestFormSchema.pick({
  requester: true,
  email: true,
  departament: true,
  client: true,
  project: true,
  invoiceNumber: true,
  clientNumber: true,
  gateway: true,
  sigmaConnection: true
})
type GeneralInfo = z.infer<typeof generalInfoSchema>


export default function Pt1({ isHidden, next, prev }: Props) {

  const [formData, setFormData] = useState<GeneralInfo | null >(null)

  const {formState: {errors}, ...form} = useForm<GeneralInfo>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      gateway: "SDG",
    }
  })

  function saveFormData(data: GeneralInfo) {
    data.email = info.requester.find(item => item.name === requester)?.email || ""
    data.departament = info.requester.find(item => item.name === requester)?.departament || ""
    setFormData(data)
    console.log(formData)
    if (next) {
      const virtualButton = document.createElement('button');
      virtualButton.onclick = next;
      virtualButton.click();
    }
   
  }

  const requester = form.watch("requester")
  const gateway = form.watch("gateway")

  return (
    <div className="p-2 gap-2" style={isHidden ? { display: "none" } : {}}>
      <h1 className="text-lg font-bold">Informações Gerais</h1>

      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(saveFormData)}>

        {/* Requester */}
        <Controller control={form.control}
          name="requester"
          render={({ field }) => (
            <>
            <InputGroup className="flex gap-2 ">
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
            {errors.requester && <InputError message={errors.requester.message}  />}
            {errors.email && <InputError message={errors.email.message}  />}
            {errors.departament && <InputError message={errors.departament.message}  />}
            </>
          )}
        />

        {/* Projeto e Cliente */}
        <InputGroup className="mt-5">
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
        {errors.project && <InputError message={errors.project.message}  />}


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
        {errors.client && <InputError message={errors.client.message}  />}

        {/* Número do Projeto e Número do Cliente */}

        <InputGroup className="mt-5">
          <InputGroupInput {...form.register("clientNumber")} placeholder="Número do cliente">
          </InputGroupInput>
          <InputGroupAddon>
            <Hash />
          </InputGroupAddon>
        </InputGroup>
        {errors.clientNumber && <InputError message={errors.clientNumber.message}  />}
        <InputGroup className="">
          <InputGroupInput {...form.register("invoiceNumber")} placeholder="Número do pedido">
          </InputGroupInput>
          <InputGroupAddon>
            <FileDigit />
          </InputGroupAddon>
        </InputGroup>
        {errors.invoiceNumber && <InputError message={errors.invoiceNumber.message}  />}

        {/* Gateway e Sigma*/}
        <Controller control={form.control}
          name="gateway"
          render={({ field }) => (
            <InputGroup className="flex gap-2 mt-5">
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um requerente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Gateway</SelectLabel>
                    {
                      info.sd.sort((a, b) => a.localeCompare(b)).map((item, index) => {
                        return (
                          <SelectItem key={index} value={item}>
                            {item}
                          </SelectItem>
                        )
                      })
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
              <InputGroupAddon className="" align="inline-start">{
                gateway === "SD+"
                ? <img src={SDP} className="w-12 h-5 drop-shadow-lg" alt="" />
                : <img src={SDG} className="w-12 h-5 drop-shadow-lg" alt="" />
              }</InputGroupAddon>

            </InputGroup>
          )}
        />
        {errors.gateway && <InputError message={errors.gateway.message}  />}

        <Controller control={form.control}
          name="sigmaConnection"
          render={({ field }) => (
            <InputGroup className="flex gap-2 mt-5">
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Comunicação com o SIGMA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Conexão</SelectLabel>
                    <SelectItem value="Sem comunicação">Sem comunicação</SelectItem>
                    <SelectItem value="Comunicação normal">Comunicação normal</SelectItem>
                    <SelectItem value="SigmaSync">SigmaSync</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <InputGroupAddon className="" align="inline-start"><Sigma className=""/> </InputGroupAddon>

            </InputGroup>
          )}
        />
        {errors.sigmaConnection && <InputError message={errors.sigmaConnection.message}  />}
        
        <footer className="flex gap-1 justify-between mt-5">
          <Button className="invisible"></Button>
          {next ? <Button type="submit"><ChevronRight /></Button> : <Button className="invisible"></Button>}
        </footer>
      </form>

    </div>
  )

}