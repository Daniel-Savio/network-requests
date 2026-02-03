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
	Copy,
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
import { useEffect, useRef } from "react";

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
	const defaultIeds: IED[] | undefined = storedFormData.entradas?.flatMap(
		(entry) => entry.ieds,
	);

	//Flatmap para pegar todos os IEDs de todas as entradas
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
		

	// Separação dos IEDs
	const iedsTreetech = allIeds
		.filter((ied) => ied.fabricante === "Treetech")
		.sort((a, b) => a.nome.localeCompare(b.nome));
	const iedsTerceiros = allIeds
		.filter((ied) => ied.fabricante !== "Treetech")
		.sort((a, b) => a.nome.localeCompare(b.nome));


	function copyIed(index: number) {
		append({
			name: control._formValues.saidas[nestIndex].ieds[index].name,
			manufacturer:
				control._formValues.saidas[nestIndex].ieds[index].manufacturer,
			address: control._formValues.saidas[nestIndex].ieds.length + 1,
			modules: control._formValues.saidas[nestIndex].ieds[index].modules,
			optional: control._formValues.saidas[nestIndex].ieds[index].optional,
		});
	}
	return (
		<div className="p-1 min-h-[255px]">
			<h3 className="font-semibold  mb-2">IEDs</h3>

			{fields.map((item, k) => (
				<motion.div
					key={k}
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
													<SelectItem key={i} value={ied.nome}>
														{ied.nome}
													</SelectItem>
												))}
												<SelectLabel className="font-bold bg-zinc-100">
													Terceiros
												</SelectLabel>
												{iedsTerceiros.map((ied, i) => (
													<SelectItem
														key={`treetech-${ied.nome}-${i}`}
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
										className="bg-radial from-zinc-200 to-zinc-300"
									>
										<Copy />
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
					<div className="flex items-center justify-center text-sm text-zinc-500 bg-zinc-100 mb-4 border-b rounded-b-md">
						{control._formValues.saidas[nestIndex].ieds[k].manufacturer
							? control._formValues.saidas[nestIndex].ieds[k].manufacturer
							: "Fabricante"}
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
													Endereço do IED correspondente ao protocolo, essa
													informação pode estar no projeto mas se não houver
													pode colocar os valores em órdem crescente começando
													em 1
												</TooltipContent>
											</Tooltip>
										</InputGroupAddon>
									</InputGroup>
								)}
							/>
							{(control._formValues.saidas[nestIndex].ieds[k].name === "BM" ||
								control._formValues.saidas[nestIndex].ieds[k].name ===
									"COMM4" ||
								control._formValues.saidas[nestIndex].ieds[k].name ===
									"Entrada Digital do gateway") && (
								<Controller
									name={`saidas.${nestIndex}.ieds.${k}.modules`}
									control={control}
									render={({ field }) => (
										<InputGroup className="w-full">
											<InputGroupInput
												className="w-full"
												type="number"
												placeholder="Módulos"
												{...field}
											/>
											<InputGroupAddon align="inline-end">
												<Tooltip>
													<TooltipTrigger asChild>
														<InputGroupButton>
															<CircleQuestionMark className="size-4" />
														</InputGroupButton>
													</TooltipTrigger>
													<TooltipContent className="max-w-40 text-justify">
														Quantidade de módulos do IED, ou quantidade de SPSs
														conectados ou quantiade de saidas Digitais para
														serem mapeadas
													</TooltipContent>
												</Tooltip>
											</InputGroupAddon>
										</InputGroup>
									)}
								/>
							)}
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
											<Tooltip>
												<TooltipTrigger asChild>
													<InputGroupButton>
														<CircleQuestionMark className="size-4" />
													</InputGroupButton>
												</TooltipTrigger>
												<TooltipContent className="max-w-45 text-justify">
													Caso seja necessário habilitar algum opcional do IED,
													como por exemplo a leitura de Tap do AVR ou
													Diferencial de temperatura do TM.
													<br className="h-2" />
													<br className="h-2" />
													Caso não haja nenhum opcional:
													<br className="h-2" />
													<strong className="font-bolder text-sm">
														Pode deixar em branco.
													</strong>
												</TooltipContent>
											</Tooltip>
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
							address: control._formValues.saidas[nestIndex].ieds.length + 1,
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
