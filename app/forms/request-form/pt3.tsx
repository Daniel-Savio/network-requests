import { Button } from "@/components/ui/button";
import { useRequestStore } from "./store";
import { requestFormSchema } from "./types";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type z from "zod";
import info from "@/lib/request-info.json";
import {
	Cable,
	ChevronLeft,
	ChevronRight,
	EthernetPort,
	Plus,
	X,
} from "lucide-react";
import type { index } from "@react-router/dev/routes";
import { AnimatePresence, motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef } from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	SelectTrigger,
	Select,
	SelectValue,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectItem,
} from "@/components/ui/select";
import { SiHandshakeProtocol } from "react-icons/si";
import InputError from "@/components/error";
import { IedArray } from "./ieds";

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

interface Props {
	isHidden: boolean;
	next?: () => void;
	prev?: () => void;
}
const restrictedValues = ["71-72", "74-75", "71-72-73"];

const outputInfoSchema = requestFormSchema.pick({
	saidas: true,
});
type OutputInfo = z.infer<typeof outputInfoSchema>;



export default function Pt3({ isHidden, next, prev }: Props) {
	const storedFormData = useRequestStore((state) => state);
	const inputRef = useRef<HTMLDivElement[] | null>([]);

    const uniqueTypes: string[] = storedFormData ? [...new Set(storedFormData.entradas?.map((entry) => entry.type))] : [];

    const remainingOptions = info.saidas.filter(option => !uniqueTypes.includes(option));
    console.log(remainingOptions)

	// Form
	const {
		formState: { errors },
		control,
		...form
	} = useForm<OutputInfo>({
		// resolver: zodResolver(outputInfoSchema),
		defaultValues: {
			saidas: storedFormData.saidas || [
				{
					protocolo: "Modbus",
					type: "TCP/IP",
					ip: "192.168.10.87",
					port: "502",
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
		name: "saidas",
	});

	const watchedSaidas = form.watch("saidas");

	function saveFormData(data: OutputInfo) {
		console.log("Saving output data:", data);
	}

	return (
		<div className="p-2 gap-2" style={isHidden ? { display: "none" } : {}}>
			<form onSubmit={form.handleSubmit(saveFormData)}>
				<h1 className="text-lg font-bold">Saídas</h1>

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
								{/* Output field Header */}
								<div
									id={index.toString()}
									className="flex justify-between items-center mb-2 border-b-2 pb-1"
									ref={(el) => {
										if (inputRef.current) {
											inputRef.current[index] = el!;
										}
									}}
								>
									<div className="flex gap-2 items-center ">
										{watchedSaidas?.[index]?.type === "TCP/IP" ? (
											<EthernetPort className="size-4" />
										) : (
											<Cable className="size-4" />
										)}
										<h2 className="font-semibold"> {index + 1}° Saída </h2>
										<span className="text-zinc-400">
											{watchedSaidas?.[index]?.type}
										</span>
										<span className="text-zinc-400">
											{watchedSaidas?.[index]?.protocolo}
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
											name={`saidas.${index}.protocolo`}
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
																	{info.protocolos_saida
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
													{errors.saidas?.[index]?.protocolo && (
														<InputError
															message={
																errors.saidas?.[index]?.protocolo?.message
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
											name={`saidas.${index}.type`}
											control={control}
											rules={{ required: "Campo obrigatório" }}
											render={({ field }) => {
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
																		{remainingOptions
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
														{errors.saidas?.[index]?.type && (
															<InputError
																message={errors.saidas?.[index]?.type?.message}
															/>
														)}
													</>
												);
											}}
										/>
									</motion.div>

									{form.watch(`saidas.${index}.type`) === "TCP/IP" ? (
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
													name={`saidas.${index}.ip`}
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
															{errors.saidas?.[index]?.ip && (
																<InputError
																	message={errors.saidas?.[index]?.ip?.message}
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
													name={`saidas.${index}.port`}
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
															{errors.saidas?.[index]?.port && (
																<InputError
																	message={
																		errors.saidas?.[index]?.port?.message
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
													name={`saidas.${index}.baudRate`}
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
															{errors.saidas?.[index]?.baudRate && (
																<InputError
																	message={
																		errors.saidas?.[index]?.baudRate?.message
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
													name={`saidas.${index}.dataBits`}
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
															{errors.saidas?.[index]?.dataBits && (
																<InputError
																	message={
																		errors.saidas?.[index]?.dataBits?.message
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
													name={`saidas.${index}.parity`}
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
															{errors.saidas?.[index]?.parity && (
																<InputError
																	message={
																		errors.saidas?.[index]?.parity?.message
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
													name={`saidas.${index}.stopBits`}
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
															{errors.saidas?.[index]?.stopBits && (
																<InputError
																	message={
																		errors.saidas?.[index]?.stopBits?.message
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
									<IedArray
										nestIndex={index}
										control={control}
										setValue={form.setValue}
									></IedArray>
								</TabsContent>

								<TabsList className="w-full">
									<TabsTrigger className="cursor-pointer" value="def">
										Definições
									</TabsTrigger>
									<TabsTrigger className="cursor-pointer" value="ieds">
										IEDs
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
					<Plus className="h-4 w-4 mr-2" /> Adicionar Saída
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


