import { Button } from "@/components/ui/button";
import { requestFormSchema, type IED } from "./types";
import { set, z } from "zod";
import {  useRequestStore } from "./store";
import { toast } from "sonner";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Cable,
	ChevronLeft,
	ChevronRight,
	EthernetPort,
	Plus,
	X,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import info from "@/lib/request-info.json";
import { SiHandshakeProtocol } from "react-icons/si";
import InputError from "@/components/error";
import { AnimatePresence, motion } from "motion/react";
import { IedArrayInput } from "./ieds-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { use, useRef } from "react";

interface Props {
	isHidden: boolean;
	next?: () => void;
	prev?: () => void;
}
const inputInfoSchema = requestFormSchema.pick({
	entradas: true,
});

type InputInfo = z.infer<typeof inputInfoSchema>;

const restrictedValues = ["71-72", "74-75", "71-72-73"];

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

export default function Pt2({ isHidden, next, prev }: Props) {
	const inputRef = useRef<HTMLDivElement[] | null>([]);
	const storeData = useRequestStore((state) => state.setData);
	const storedEntradas = useRequestStore((state) => state.entradas);

	let allIeds: IED[] = [];
	let prevAllIeds: IED[] =
		storedEntradas?.flatMap((entrada) => entrada.ieds) || [];

	const {
		formState: { errors },
		control,
		...form
	} = useForm<InputInfo>({
		// resolver: zodResolver(inputInfoSchema),
		defaultValues: {
			entradas: storedEntradas || [
				{
					protocolo: "",
					type: "",
					ip: "",
					port: "",
					baudRate: "9600",
					dataBits: "8",
					parity: "None",
					stopBits: "1",
				},
			],
		},
	});
	const { fields, append, remove } = useFieldArray({
		control,
		name: "entradas",
	});
	const watchedEntradas = form.watch("entradas");

	function saveFormData(data: InputInfo) {
		let isValid = true;
		try {
			if (!data.entradas || data.entradas.length === 0) {
				throw new Error("Adicione ao menos uma entrada.");
			}
			for (const [index, entrada] of data.entradas.entries()) {
				if (!isValid) break;
				if (!entrada.ieds || entrada.ieds.length === 0) {
					window.scrollTo({
						top: inputRef.current![index].offsetTop,
						behavior: "smooth",
					});
					throw new Error(`Adicione ao menos um IED na ${index + 1}° entrada.`);
				}

				for (const [iedIndex, ied] of entrada.ieds.entries()) {
					if (!ied.name || !ied.manufacturer) {
						throw new Error(
							`IED ${iedIndex + 1} não foi selecionado  na ${index + 1}° entrada.`,
						);
					} else if (ied.name === "BM" && ied.modules === "") {
						throw new Error(
							`IED ${iedIndex + 1} - ${ied.name} não possui módulos selecionados na ${index + 1}° entrada.`,
						);
					} else if (ied.name === "Entradas Digitais" && ied.modules === "") {
						throw new Error(
							`IED ${iedIndex + 1} - ${ied.name} não possui nenhum borne selecionado na ${index + 1}° entrada.`,
						);
					} else if (ied.name === "COMM4" && ied.modules === "") {
						throw new Error(
							`IED ${iedIndex + 1} - ${ied.name} não possui nenhum número de SPS atrelado na ${index + 1}° entrada.`,
						);
					}
				}
			}

			if (isValid) {
				storeData(data);

				if (next) {
					const virtualButton = document.createElement("button");
					virtualButton.onclick = next;
					virtualButton.click();
				}
			}
		} catch (error: any) {
			isValid = false;
			toast.error(
				error.message ||
					"Erro ao salvar os dados. Verifique as informações e tente novamente.",
			);
		}
	}

	return (
		<div className="p-2 gap-2" style={isHidden ? { display: "none" } : {}}>
			<form onSubmit={form.handleSubmit(saveFormData)}>
				<h1 className="text-lg font-bold">Entradas</h1>

				{/* !! Entradas !!  */}
				{fields.map((currentField, index) => (
					<AnimatePresence key={index}>
						<Tabs defaultValue="def">
							<motion.div
								animate={{ x: 0, opacity: 1 }}
								initial={{ x: 30, opacity: 0 }}
								transition={{
									duration: 0.3,
									delay: 0.1,
									type: "spring" as const,
									stiffness: 500,
								}}
								key={currentField.id}
								className="flex flex-col gap-2 border p-2 rounded-md mt-4"
							>
								<div
									id={index.toString()}
									className="flex justify-between items-center mb-2 border-b-2 pb-1"
									ref={(el) => {
										if (inputRef.current) {
											inputRef.current[index] = el!;
										}
									}}
								>
									<div className="flex gap-2 items-center">
										{watchedEntradas?.[index]?.type === "TCP/IP" ? (
											<EthernetPort className="size-4" />
										) : (
											<Cable className="size-4" />
										)}
										<h2 className="font-semibold"> {index + 1}° Entrada </h2>
										<span className="text-zinc-400">
											{watchedEntradas?.[index]?.type}
										</span>
										<span className="text-zinc-400">
											{watchedEntradas?.[index]?.protocolo}
										</span>
									</div>
									<Button
										variant={"destructive"}
										className=""
										onClick={() => remove(index)}
									>
										<p className="text-sm">Remover</p>
										<X className="size-4" />
									</Button>
								</div>

								<TabsContent value="def">
									{/* Protocolo */}
									<motion.div
										initial={bouncingUpAnimation.initial}
										transition={bouncingUpAnimation.transition}
										whileInView={bouncingUpAnimation.whileInView}
									>
										<Controller
											name={`entradas.${index}.protocolo`}
											control={control}
											rules={{ required: "Campo obrigatório" }}
											render={({ field }) => (
												<>
													<InputGroup>
														<Select
															onValueChange={field.onChange}
															value={field.value}
														>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Selecione um protocolo" />
															</SelectTrigger>
															<SelectContent>
																<SelectGroup>
																	<SelectLabel>Protocolos</SelectLabel>
																	{info.protocolos_entrada
																		.sort((a, b) => a.localeCompare(b))
																		.map((item, index) => {
																			return (
																				<SelectItem key={index} value={item}>
																					{item}
																				</SelectItem>
																			);
																		})}
																</SelectGroup>
															</SelectContent>
														</Select>
														<InputGroupAddon>
															<SiHandshakeProtocol />
														</InputGroupAddon>
													</InputGroup>
													{errors.entradas?.[index]?.protocolo && (
														<InputError
															message={
																errors.entradas?.[index]?.protocolo?.message
															}
														/>
													)}
												</>
											)}
										/>
									</motion.div>
									{/* Conexão */}
									<motion.div
										initial={bouncingUpAnimation.initial}
										transition={{
											...bouncingUpAnimation.transition,
											delay: 0.4,
										}}
										whileInView={bouncingUpAnimation.whileInView}
										className="mb-5"
									>
										<Controller
											name={`entradas.${index}.type`}
											control={control}
											rules={{ required: "Campo obrigatório" }}
											render={({ field }) => {
												const otherSelectedValues =
													watchedEntradas
														?.filter((_, i) => i !== index)
														.map((e) => e.type) ?? [];
												const filteredOptions = info.entradas.filter(
													(option) => {
														if (restrictedValues.includes(option)) {
															return !otherSelectedValues.includes(option);
														}
														return true;
													},
												);

												return (
													<>
														<InputGroup>
															<Select
																onValueChange={field.onChange}
																value={field.value}
															>
																<SelectTrigger className="w-full">
																	<SelectValue placeholder="Selecione uma conexão" />
																</SelectTrigger>
																<SelectContent>
																	<SelectGroup>
																		<SelectLabel>Opções de entrada</SelectLabel>
																		{field.value &&
																			!filteredOptions.includes(
																				field.value,
																			) && (
																				<SelectItem value={field.value}>
																					{field.value}
																				</SelectItem>
																			)}
																		{filteredOptions
																			.sort((a, b) => a.localeCompare(b))
																			.map((item, index) => {
																				return (
																					<SelectItem key={index} value={item}>
																						{item}
																					</SelectItem>
																				);
																			})}
																	</SelectGroup>
																</SelectContent>
															</Select>
															<InputGroupAddon>
																<SiHandshakeProtocol />
															</InputGroupAddon>
														</InputGroup>
														{errors.entradas?.[index]?.type && (
															<InputError
																message={
																	errors.entradas?.[index]?.type?.message
																}
															/>
														)}
													</>
												);
											}}
										/>
									</motion.div>

									{form.watch(`entradas.${index}.type`) === "TCP/IP" ? (
										<>
											{/* IP */}
											<motion.div
												initial={bouncingUpAnimation.initial}
												whileInView={bouncingUpAnimation.whileInView}
												transition={{
													...bouncingUpAnimation.transition,
													delay: 0.3,
												}}
											>
												<Controller
													name={`entradas.${index}.ip`}
													control={control}
													rules={{ required: "Campo obrigatório" }}
													render={({ field }) => (
														<>
															<InputGroup>
																<InputGroupInput
																	placeholder="Endereço IP"
																	{...field}
																/>
																<InputGroupAddon>
																	<EthernetPort />
																</InputGroupAddon>
															</InputGroup>
															{errors.entradas?.[index]?.ip && (
																<InputError
																	message={
																		errors.entradas?.[index]?.ip?.message
																	}
																/>
															)}
														</>
													)}
												/>
											</motion.div>
											{/* Port */}
											<motion.div
												initial={bouncingUpAnimation.initial}
												whileInView={bouncingUpAnimation.whileInView}
												transition={{
													...bouncingUpAnimation.transition,
													delay: 0.4,
												}}
												className="mb-5"
											>
												<Controller
													name={`entradas.${index}.port`}
													control={control}
													rules={{ required: "Campo obrigatório" }}
													render={({ field }) => (
														<>
															<InputGroup>
																<InputGroupInput
																	placeholder="Porta"
																	{...field}
																/>
																<InputGroupAddon>
																	<EthernetPort />
																</InputGroupAddon>
															</InputGroup>
															{errors.entradas?.[index]?.port && (
																<InputError
																	message={
																		errors.entradas?.[index]?.port?.message
																	}
																/>
															)}
														</>
													)}
												/>
											</motion.div>
										</>
									) : (
										<>
											{/* Baudrate */}
											<motion.div
												initial={bouncingUpAnimation.initial}
												whileInView={bouncingUpAnimation.whileInView}
												transition={{
													...bouncingUpAnimation.transition,
													delay: 0.3,
												}}
											>
												<Controller
													name={`entradas.${index}.baudRate`}
													control={control}
													rules={{ required: "Campo obrigatório" }}
													render={({ field }) => (
														<>
															<InputGroup>
																<Select
																	onValueChange={field.onChange}
																	value={field.value}
																>
																	<SelectTrigger className="w-full">
																		<SelectValue placeholder="Selecione um valor" />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectGroup>
																			<SelectLabel>Velocidades</SelectLabel>

																			<SelectItem value={"9600"}>
																				9600
																			</SelectItem>
																			<SelectItem value={"115200"}>
																				115200
																			</SelectItem>
																			<SelectItem value={"4800"}>
																				4800
																			</SelectItem>
																			<SelectItem value={"14400"}>
																				4800
																			</SelectItem>
																			<SelectItem value={"19200"}>
																				19200
																			</SelectItem>
																			<SelectItem value={"28800"}>
																				28800
																			</SelectItem>
																		</SelectGroup>
																	</SelectContent>
																</Select>
																<InputGroupAddon className="px-2">
																	<Cable />
																	BaudRate
																</InputGroupAddon>
															</InputGroup>
															{errors.entradas?.[index]?.baudRate && (
																<InputError
																	message={
																		errors.entradas?.[index]?.baudRate?.message
																	}
																/>
															)}
														</>
													)}
												/>
											</motion.div>
											{/* Databits */}
											<motion.div
												initial={bouncingUpAnimation.initial}
												whileInView={bouncingUpAnimation.whileInView}
												transition={{
													...bouncingUpAnimation.transition,
													delay: 0.4,
												}}
											>
												<Controller
													name={`entradas.${index}.dataBits`}
													control={control}
													rules={{ required: "Campo obrigatório" }}
													render={({ field }) => (
														<>
															<InputGroup>
																<Select
																	onValueChange={field.onChange}
																	value={field.value}
																>
																	<SelectTrigger className="w-full">
																		<SelectValue placeholder="Selecione um valor" />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectGroup>
																			<SelectLabel>Valores</SelectLabel>
																			<SelectItem value={"8"}>8</SelectItem>
																			<SelectItem value={"7"}>7</SelectItem>
																		</SelectGroup>
																	</SelectContent>
																</Select>
																<InputGroupAddon className="px-2">
																	<Cable />
																	DataBits
																</InputGroupAddon>
															</InputGroup>
															{errors.entradas?.[index]?.dataBits && (
																<InputError
																	message={
																		errors.entradas?.[index]?.dataBits?.message
																	}
																/>
															)}
														</>
													)}
												/>
											</motion.div>

											{/* parity */}
											<motion.div
												initial={bouncingUpAnimation.initial}
												whileInView={bouncingUpAnimation.whileInView}
												transition={{
													...bouncingUpAnimation.transition,
													delay: 0.5,
												}}
											>
												<Controller
													name={`entradas.${index}.parity`}
													control={control}
													rules={{ required: "Campo obrigatório" }}
													render={({ field }) => (
														<>
															<InputGroup>
																<Select
																	onValueChange={field.onChange}
																	value={field.value}
																>
																	<SelectTrigger className="w-full">
																		<SelectValue placeholder="Selecione um valor" />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectGroup>
																			<SelectLabel>Valores</SelectLabel>
																			<SelectItem value={"None"}>
																				None
																			</SelectItem>
																			<SelectItem value={"Odd"}>Odd</SelectItem>
																			<SelectItem value={"Even"}>
																				Even
																			</SelectItem>
																		</SelectGroup>
																	</SelectContent>
																</Select>
																<InputGroupAddon className="px-2">
																	<Cable />
																	Paridade
																</InputGroupAddon>
															</InputGroup>
															{errors.entradas?.[index]?.parity && (
																<InputError
																	message={
																		errors.entradas?.[index]?.parity?.message
																	}
																/>
															)}
														</>
													)}
												/>
											</motion.div>

											{/* stopBits */}
											<motion.div
												initial={bouncingUpAnimation.initial}
												whileInView={bouncingUpAnimation.whileInView}
												transition={{
													...bouncingUpAnimation.transition,
													delay: 0.6,
												}}
												className="mb-5"
											>
												<Controller
													name={`entradas.${index}.stopBits`}
													control={control}
													rules={{ required: "Campo obrigatório" }}
													render={({ field }) => (
														<>
															<InputGroup>
																<Select
																	onValueChange={field.onChange}
																	value={field.value}
																>
																	<SelectTrigger className="w-full">
																		<SelectValue placeholder="Selecione um valor" />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectGroup>
																			<SelectLabel>Valores</SelectLabel>
																			<SelectItem value={"1"}>1</SelectItem>
																			<SelectItem value={"2"}>2</SelectItem>
																		</SelectGroup>
																	</SelectContent>
																</Select>
																<InputGroupAddon className="px-2">
																	<Cable />
																	StopBit
																</InputGroupAddon>
															</InputGroup>
															{errors.entradas?.[index]?.stopBits && (
																<InputError
																	message={
																		errors.entradas?.[index]?.stopBits?.message
																	}
																/>
															)}
														</>
													)}
												/>
											</motion.div>
										</>
									)}
								</TabsContent>

								<TabsContent value="ieds">
									{" "}
									<IedArrayInput
										nestIndex={index}
										control={control}
										setValue={form.setValue}
									></IedArrayInput>
								</TabsContent>

								<TabsList className="w-full">
									<TabsTrigger className="cursor-pointer" value="def">
										Definições
									</TabsTrigger>
									<TabsTrigger className="cursor-pointer" value="ieds">
										IEDs
										<span
											className={
												!form.getValues(`entradas.${index}.ieds`)?.length
													? "text-red-500"
													: "text-green-600" + " font-bold ml-1"
											}
										>
											{form.getValues(`entradas.${index}.ieds`)?.length ||
												"Nenhum IED selecionado"}
										</span>
									</TabsTrigger>
								</TabsList>
							</motion.div>
						</Tabs>
					</AnimatePresence>
				))}

				<Button
					type="button"
					variant="default"
					className="mt-4 w-full font-bold"
					onClick={() =>
						append({
							protocolo: "",
							type: "",
							baudRate: "9600",
							dataBits: "8",
							parity: "None",
							stopBits: "1",
							ip: "",
							port: "",
							ieds: [],
						})
					}
				>
					<Plus className="h-4 w-4 mr-2" /> Adicionar Entrada
				</Button>

				<footer className="flex gap-1 justify-between mt-5">
					{prev ? (
						<Button type="button" onClick={prev}>
							<ChevronLeft />
						</Button>
					) : (
						<Button className="invisible"></Button>
					)}
					{next ? (
						<Button type="submit">
							<ChevronRight />
						</Button>
					) : (
						<Button className="invisible"></Button>
					)}
				</footer>
			</form>
		</div>
	);
}
