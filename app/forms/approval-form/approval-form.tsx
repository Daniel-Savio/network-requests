import { Button } from "@/components/ui/button";
import { approvalScheema, type ApprovalFormType } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import info from "@/lib/request-info.json";
import SDG from "/SDg.png";
import SDP from "/SDp.png";
import {
	CircleQuestionMark,
	Computer,
	Factory,
	Link2,
	Scroll,
	Shell,
	Sigma,
	Users,
	X,
} from "lucide-react";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectItem,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import InputError from "@/components/error";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function ApprovalForm() {
	const [formData, setFormData] = useState<ApprovalFormType | null>(null);

	const {
		formState: { errors },
		...form
	} = useForm<ApprovalFormType>({
		resolver: zodResolver(approvalScheema) as any,
		defaultValues: { approval: "Mapeamento" },
	});

	function saveFormData(data: ApprovalFormType) {
		data.email =
			info.requester.find((item) => item.name === requester)?.email || "";
		data.departament =
			info.requester.find((item) => item.name === requester)?.departament || "";
		setFormData(data);
		console.log(formData);
	}

	const requester = form.watch("requester");

	return (
		<div className="p-2 gap-2">
			<h1 className="text-lg font-bold">Informações Gerais</h1>

			<form
				onSubmit={form.handleSubmit(saveFormData)}
				className="flex flex-col gap-4"
			>
				{/* Homologação ou Mapeamento */}
				<Controller
					control={form.control}
					name="approval"
					render={({ field }) => (
						<div className="flex items-center space-x-4 border p-3 rounded-md justify-between bg-zinc-50/50">
							<div className="flex flex-col gap-1">
								<Label htmlFor="approval-mode" className="font-bold">
									Tipo de Solicitação
								</Label>
								<span className="text-sm text-zinc-500">
									{field.value === "Homologação"
										? "Homologação de novo IED. É necessário enviar um exemplar deste IED ao SAM para testes"
										: "Mapeamento de pontos"}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span
									className={`text-sm ${field.value !== "Homologação" ? "font-bold text-primary" : "text-zinc-400"}`}
								>
									Mapeamento
								</span>
								<Switch
									id="approval-mode"
									checked={field.value === "Homologação"}
									onCheckedChange={(checked) =>
										field.onChange(checked ? "Homologação" : "Mapeamento")
									}
								/>
								<span
									className={`text-sm ${field.value === "Homologação" ? "font-bold text-primary" : "text-zinc-400"}`}
								>
									Homologação
								</span>
							</div>
						</div>
					)}
				/>

				{/* Requester */}
				<Controller
					control={form.control}
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
											{info.requester
												.sort((a, b) => a.name.localeCompare(b.name))
												.map((item, index) => {
													return (
														<SelectItem key={index} value={item.name}>
															{item.name}
														</SelectItem>
													);
												})}
										</SelectGroup>
									</SelectContent>
								</Select>
								<InputGroupAddon align={"inline-start"}>
									<Users />
								</InputGroupAddon>
								<InputGroupAddon
									className="w-full text-zinc-500"
									align="inline-end"
								>
									{requester ? (
										info.requester.find((item) => item.name === requester)
											?.departament
									) : (
										<span className="text-zinc-500">Departamento</span>
									)}
								</InputGroupAddon>
							</InputGroup>
							{errors.requester && (
								<InputError message={errors.requester.message} />
							)}
							{errors.email && <InputError message={errors.email.message} />}
							{errors.departament && (
								<InputError message={errors.departament.message} />
							)}
						</>
					)}
				/>

				{/*  Cliente */}
				<InputGroup>
					<InputGroupInput
						{...form.register("client")}
						placeholder="Nome do Cliente - Nome da Fábrica - Interno"
					></InputGroupInput>
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
							<TooltipContent className="max-w-40 text-justify">
								Coloque aqui o nome do cliente que receberá a aplicação ou
								"Interno" caso seja para a própria Treetech
							</TooltipContent>
						</Tooltip>
					</InputGroupAddon>
				</InputGroup>
				{errors.client && <InputError message={errors.client.message} />}

				{/* Nome do Fabricante */}
				<InputGroup>
					<InputGroupInput
						{...form.register("manufacturer")}
						placeholder="Nome do Fabricante do IED ou da empresa representante"
					></InputGroupInput>
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
							<TooltipContent className="max-w-40 text-justify">
								Coloque aqui o nome da empresa responsável pela fabricação ou
								comercialização do IED para caso necessitemos de apoio
							</TooltipContent>
						</Tooltip>
					</InputGroupAddon>
				</InputGroup>
				{errors.manufacturer && (
					<InputError message={errors.manufacturer.message} />
				)}

				<Separator className="my-2"></Separator>

				{/* Nome do IED */}
				<InputGroup>
					<InputGroupInput
						{...form.register("name")}
						placeholder="Nome do IED"
					></InputGroupInput>
					<InputGroupAddon>
						<Computer />
					</InputGroupAddon>
					<InputGroupAddon align={"inline-end"}>
						<Tooltip>
							<TooltipTrigger asChild>
								<InputGroupButton>
									<CircleQuestionMark className="size-4" />
								</InputGroupButton>
							</TooltipTrigger>
							<TooltipContent className="max-w-40 text-justify">
								Nome do IED a ser homologado ou mapeado
							</TooltipContent>
						</Tooltip>
					</InputGroupAddon>
				</InputGroup>
				{errors.name && <InputError message={errors.name.message} />}

				{/* Tipo do IED */}
				<InputGroup>
					<InputGroupInput
						{...form.register("type")}
						placeholder="Tipo do IED homologado. Ex.: Monitor de gases (DGA), Monitor de bucha, Secador de óleo"
					></InputGroupInput>
					<InputGroupAddon>
						<Shell />
					</InputGroupAddon>
					<InputGroupAddon align={"inline-end"}>
						<Tooltip>
							<TooltipTrigger asChild>
								<InputGroupButton>
									<CircleQuestionMark className="size-4" />
								</InputGroupButton>
							</TooltipTrigger>
							<TooltipContent className="max-w-40 text-justify">
								A categoria a qual o IED se encaixa, como: Monitor de gases
								(DGA), Monitor de bucha, Secador de óleo, etc.
							</TooltipContent>
						</Tooltip>
					</InputGroupAddon>
				</InputGroup>
				{errors.type && <InputError message={errors.type.message} />}

				<InputGroup>
					<InputGroupInput
						{...form.register("url")}
						placeholder="Site de acesso do fabricante"
					></InputGroupInput>
					<InputGroupAddon>
						<Link2 />
					</InputGroupAddon>
					<InputGroupAddon align={"inline-end"}>
						<Tooltip>
							<TooltipTrigger asChild>
								<InputGroupButton>
									<CircleQuestionMark className="size-4" />
								</InputGroupButton>
							</TooltipTrigger>
							<TooltipContent className="max-w-40 text-justify">
								Site de acesso do fabricante ou diretamente do documento anexado
								para que possamos consultar
							</TooltipContent>
						</Tooltip>
					</InputGroupAddon>
				</InputGroup>
				{errors.url && <InputError message={errors.url.message} />}

				<Separator className="my-2"></Separator>

				<Controller
					control={form.control}
					name="protocols"
					render={({ field }) => (
						<InputGroup className="flex gap-2 mt-5">
							<Select onValueChange={field.onChange} value={field.value}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Protocolos" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectLabel>Conexão</SelectLabel>
										<SelectItem value="Modbus e DNP3">Modbus e DNP3</SelectItem>
										<SelectItem value="IEC61850">IEC61850</SelectItem>
										<SelectItem value="Todos">Todos</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<InputGroupAddon className="" align="inline-start">
								<Sigma className="" />{" "}
							</InputGroupAddon>
						</InputGroup>
					)}
				/>
				{errors.protocols && <InputError message={errors.protocols.message} />}

                <Separator className="my-2"></Separator>

                {/* Tipo do documento */}
				<InputGroup>
					<InputGroupInput
						{...form.register("documentType")}
						placeholder="Tipo do Documento anexado - Manual, Catálogo, Mapa de protocolos, etc."
					></InputGroupInput>
					<InputGroupAddon>
						<Scroll />
					</InputGroupAddon>
					<InputGroupAddon align={"inline-end"}>
						<Tooltip>
							<TooltipTrigger asChild>
								<InputGroupButton>
									<CircleQuestionMark className="size-4" />
								</InputGroupButton>
							</TooltipTrigger>
							<TooltipContent className="max-w-40 text-justify">
                                O tipo do documento anexado para usarmos de refereência durante o processo de homologação ou mapeamento. Como: Manual do produto, Mapa de protocolos, DataSheet ...
							</TooltipContent>
						</Tooltip>
					</InputGroupAddon>
				</InputGroup>
				{errors.documentType && <InputError message={errors.documentType.message} />}

                {/* Colocar aqui o Input para o pdf a ser importado */}


                 <Textarea {...form.register("comments")} placeholder="Coloque aqui seus comentários para a equipe do SAM a respeito desse mapeamento ou homologação do IED" />
			</form>
		</div>
	);
}
