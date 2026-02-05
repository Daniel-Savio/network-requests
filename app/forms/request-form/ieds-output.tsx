import { Controller, useFieldArray } from "react-hook-form";
import ied from "@/lib/ieds-info.json";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
	CircleQuestionMark,
	Clipboard,
	FileInput,
	ListOrdered,
	Plus,
	RectangleEllipsis,
	X,
} from "lucide-react";
import { motion } from "motion/react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRequestStore } from "./store";
import type { IED } from "./types";
import { useEffect } from "react";

export const IedArrayOutput = ({
	nestIndex,
	control,
	setValue,
}: {
	nestIndex: number;
	control: any;
	setValue: any;
}) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name: `saidas.${nestIndex}.ieds`,
	});

	const bouncingUpAnimation = {
		initial: { y: 10, opacity: 0 },
		whileInView: { y: 0, opacity: 1 },
		transition: {
			duration: 0.3,
			delay: 0.3,
			type: "spring" as const,
			stiffness: 200,
		},
	};

	const storedFormData = useRequestStore((state) => state);


	// Flatmap para pegar todos os IEDs
	const defaultIeds: IED[] | undefined = storedFormData.entradas?.flatMap(
		(entry) => entry.ieds,
	);

	const availableIeds = storedFormData.entradas
		?.flatMap((entry) => entry.ieds)
		.map((ied) => ({
			nome: ied.name,
			fabricante: ied.manufacturer,
		}));

	const allIeds = availableIeds
		? availableIeds.filter(
				(item, index, self) =>
					index ===
					self.findIndex(
						(t) => t.nome === item.nome && t.fabricante === item.fabricante,
					),
			)
		: [...ied.ied, ...ied.ied_terceiros];

	const iedsTreetech = allIeds
		.filter((ied) => ied.fabricante === "Treetech")
		.sort((a, b) => a.nome.localeCompare(b.nome));
	const iedsTerceiros = allIeds
		.filter((ied) => ied.fabricante !== "Treetech")
		.sort((a, b) => a.nome.localeCompare(b.nome));

	useEffect(() => {
		// Uso seguro do control (apenas se existir) para log
		// Mas a lógica principal deve depender de defaultIeds
		if (defaultIeds && fields.length === 0) {
			replicateInput()
		}
	}, [defaultIeds, append, fields.length]); // Adicionado fields.length nas dependências

	function copyIed(index: number) {
		// Usamos fields[index] para pegar os dados atuais de forma segura
		// Nota: fields contém valores padrão + id. Se precisar do valor digitado em tempo real
		// e o componente não for controlado, use getValues() (teria que receber via props)
		// Mas para evitar o crash, fields resolve:
		const currentItem = fields[index] as unknown as IED; // Cast simples já que fields tem a estrutura

		if (currentItem) {
			append({
				name: currentItem.name,
				manufacturer: currentItem.manufacturer,
				address: fields.length + 1,
				modules: currentItem.modules,
				optional: currentItem.optional,
			});
		}
	}

	function replicateInput() {
		remove();

		defaultIeds?.forEach((ied, index) => {
			append({
				name: ied.name,
				manufacturer: ied.manufacturer,
				address: index + 1,
				modules: ied.modules,
				optional: ied.optional,
			});
		});
	}

	return (
		<div className="p-1 min-h-[255px]">
			<header className="flex justify-between">
				<div className="flex gap-2">
					<h3 className="font-semibold  mb-2">IEDs</h3>
					<span className="text-zinc-400">
						{/* CORREÇÃO 1: Usar fields.length */}
						{fields.length}
					</span>
				</div>
				<div className="flex gap-3">
					<Button
						type="button"
						onClick={() => {
							replicateInput();
						}}
					>
						<FileInput className="size-4" />
						Replicar entradas
					</Button>
				</div>
			</header>

			{fields.map((item, k) => (
				<motion.div
					key={item.id}
					className="flex flex-col mt-2  border rounded-md"
					initial={bouncingUpAnimation.initial}
					whileInView={bouncingUpAnimation.whileInView}
					transition={{
						...bouncingUpAnimation.transition,
						delay: parseFloat(`${k * 0.1} `),
					}}
				>
					<div className="flex items-center gap-2">
						<Controller
							name={`saidas.${nestIndex}.ieds.${k}.name`}
							control={control}
							render={({ field }) => (
								<div className="w-full flex justify-between bg-zinc-200 border-b-2 shadow-2xs">
									<Select
										onValueChange={(value) => {
											field.onChange(value);
											const selectedIed = allIeds.find(
												(ied) => ied.nome === value,
											);
											if (selectedIed) {
												setValue(
													`saidas.${nestIndex}.ieds.${k}.manufacturer`,
													selectedIed.fabricante,
												);
											}
										}}
										value={field.value}
									>
										<SelectTrigger className="w-full rounded-none border-0 text-md">
											<SelectValue placeholder="Selecione um IED" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel className="text-primary font-bold bg-zinc-100">
													Treetech
												</SelectLabel>
												{iedsTreetech.map((ied, i) => (
													<SelectItem key={`tree-${i}`} value={ied.nome}>
														{ied.nome}
													</SelectItem>
												))}
												<SelectLabel className="font-bold bg-zinc-100">
													Terceiros
												</SelectLabel>
												{iedsTerceiros.map((ied, i) => (
													<SelectItem
														key={`other-${ied.nome}-${i}`}
														value={ied.nome}
													>
														{ied.nome} - {ied.fabricante}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>

									<Button
										onClick={() => {
											copyIed(k);
										}}
										type="button"
										variant="outline"
										className="bg-radial from-zinc-200 to-blue-300"
									>
										<Clipboard />
									</Button>

									<Button
										type="button"
										variant="outline"
										className="bg-linear-to-r from-zinc-200 to-red-200 hover:bg-red-200 "
										onClick={() => remove(k)}
									>
										<X className="size-4 text-red-700" />
									</Button>
								</div>
							)}
						/>
					</div>

					{/* Renderização condicional do fabricante - EVITANDO CRASH */}
					<div className="flex items-center justify-center text-sm text-zinc-500 bg-zinc-100 mb-4 border-b rounded-b-md">
						<Controller
							name={`saidas.${nestIndex}.ieds.${k}.manufacturer`}
							control={control}
							render={({ field }) => <span>{field.value || "Fabricante"}</span>}
						/>
					</div>

					<section className="space-y-2">
						<div className="flex items-center gap-2 w-full">
							<Controller
								name={`saidas.${nestIndex}.ieds.${k}.address`}
								control={control}
								render={({ field }) => (
									<InputGroup className="w-full">
										<InputGroupInput
											className="w-full"
											type="number"
											placeholder="Endereço"
											{...field}
											value={field.value || ""}
										/>
										<InputGroupAddon>
											<ListOrdered />
										</InputGroupAddon>
										<InputGroupAddon align="inline-end">
											<Tooltip>
												<TooltipTrigger asChild>
													<InputGroupButton>
														<CircleQuestionMark className="size-4" />
													</InputGroupButton>
												</TooltipTrigger>
												<TooltipContent className="max-w-40 text-justify">
													Endereço do IED...
												</TooltipContent>
											</Tooltip>
										</InputGroupAddon>
									</InputGroup>
								)}
							/>

							{/* Render Condicional usando Watch/Controller value seria o ideal, mas checando via control._formValues precisa de null check */}
							<Controller
								name={`saidas.${nestIndex}.ieds.${k}.name`}
								control={control}
								render={({ field: { value: nameValue } }) => (
									<>
										{(nameValue === "BM" ||
											nameValue === "COMM4" ||
											nameValue === "Entrada Digital do gateway") && (
											<Controller
												name={`saidas.${nestIndex}.ieds.${k}.modules`}
												control={control}
												render={({ field }) => (
													<InputGroup className="w-full">
														<InputGroupInput
															className="w-full"
															type="number"
															disabled
															placeholder="Módulos"
															{...field}
														/>
														<InputGroupAddon align="inline-end">
															{/* Tooltip ... */}
															<CircleQuestionMark className="size-4" />
														</InputGroupAddon>
													</InputGroup>
												)}
											/>
										)}
									</>
								)}
							/>
						</div>
						<div>
							<Controller
								name={`saidas.${nestIndex}.ieds.${k}.optional`}
								control={control}
								render={({ field }) => (
									<InputGroup>
										<InputGroupInput
											placeholder="Opcionais"
											{...field}
											value={field.value || ""}
										/>
										<InputGroupAddon align="inline-start">
											<RectangleEllipsis />
										</InputGroupAddon>
										<InputGroupAddon align="inline-end">
											{/* Tooltip */}
											<CircleQuestionMark className="size-4" />
										</InputGroupAddon>
									</InputGroup>
								)}
							/>
						</div>
					</section>
				</motion.div>
			))}

			<motion.div
				animate={{ x: 0, opacity: 1 }}
				initial={{ x: 30, opacity: 0 }}
				transition={{}}
				className="mt-2 w-full"
			>
				<Button
					type="button"
					variant="outline"
					className="w-full"
					onClick={() =>
						append({
							name: "",
							manufacturer: "",
							// CORREÇÃO 2: Usar fields.length + 1
							address: fields.length + 1,
							modules: "",
							optional: "",
						})
					}
				>
					<Plus className="size-4 mr-2" /> Adicionar IED
				</Button>
			</motion.div>
		</div>
	);
};
