import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Image,
	Font,
} from "@react-pdf/renderer";
import logo from "../../../public/logo.png";
import SDp from "../../../public/SDp.png";
import SDg from "../../../public/SDg.png";
import type { RequestForm } from "./types";

Font.register({
	family: "Univers",
	src: new URL("../../../public/univers.ttf", import.meta.url).href,
});

const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#FFFFFF",
		padding: 30,
		fontFamily: "Helvetica",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
		borderBottomWidth: 2,
		borderBottomColor: "#CCCCCC",
		paddingBottom: 10,
	},
	logo: {
		width: 100,
	},
	title: {
		fontSize: 24,
		textAlign: "center",
		color: "#333333",
		fontFamily: "Univers",
		fontWeight: 600,
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		fontSize: 18,
		fontWeight: 600,
		marginBottom: 10,
		color: "#008242",
		borderBottomWidth: 1,
		borderBottomColor: "#CCCCCC",
		paddingBottom: 5,
		fontFamily: "Univers",
	},
	subsection: {
		marginBottom: 10,
		marginLeft: 10,
	},
	subsectionTitle: {
		fontSize: 14,
		marginBottom: 5,
		color: "#333333",
		fontFamily: "Univers",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 3,
	},
	label: {
		fontSize: 12,
		fontWeight: "bold",
		color: "#555555",
	},
	value: {
		fontSize: 12,
		color: "#333333",
	},
	footer: {
		position: "absolute",
		bottom: 30,
		left: 30,
		right: 30,
		textAlign: "center",
		color: "grey",
		fontSize: 10,
	},
	table: {
		display: "flex",
		width: "auto",
		borderStyle: "solid",
		borderWidth: 1,
		borderRightWidth: 0,
		borderBottomWidth: 0,
	},
	tableRow: {
		margin: "auto",
		flexDirection: "row",
	},
	tableColHeader: {
		width: "25%",
		borderStyle: "solid",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderRightWidth: 0,
		borderTopWidth: 0,
		padding: 5,
	},
	tableCol: {
		width: "25%",
		borderStyle: "solid",
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0,
		borderRightWidth: 0,
		padding: 5,
	},
	tableCellHeader: {
		margin: "auto",
		marginTop: 5,
		fontSize: 12,
		fontWeight: "bold",
		color: "#008242",
	},
	tableCell: {
		margin: "auto",
		marginTop: 5,
		fontSize: 10,
	},
	iedTable: {
		display: "flex",
		width: "auto",
		marginTop: 10,
	},
	iedTableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#CCCCCC",
		alignItems: "center",
		padding: 5,
	},
	iedTableCell: {
		fontSize: 10,
		textAlign: "left",
		padding: 2,
	},
	highligth: {
		backgroundColor: "#93f57bc7",
		padding: 2,
		borderRadius: 4,
	},
	highligthBlue: {
		backgroundColor: "#7be3f5c6",
		padding: 2,
		borderRadius: 4,
	},
	highligthYellow: {
		backgroundColor: "#f5ed7bc5",
		padding: 2,
		borderRadius: 4,
	},
});

export const MyDocument = ({
	data,
	comment,
}: {
	data: RequestForm;
	comment: string;
}) => {
	const inputProtocols = [
		...new Set(data.entradas?.map((e: any) => e.protocolo) || []),
	];
	const outputProtocols = [
		...new Set(data.saidas?.map((s: any) => s.protocolo) || []),
	];

	const allIeds = data.entradas
		?.flatMap((entry) => entry.ieds)
		.map((ied) => ({
			nome: ied.name,
			fabricante: ied.manufacturer,
		}));

	const thirdPartIeds = allIeds!
		.filter((ied) => ied.fabricante !== "Treetech")
		.sort((a, b) => a.nome.localeCompare(b.nome));

	return (
		<Document>
			{/* Page 1: Summary */}
			<Page size="A4" style={styles.page}>
				<View style={styles.header} fixed>
					<Image src={logo} style={styles.logo} />
					<Text style={styles.title}>Requisição de Aplicação</Text>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionTitle}>
						<Text>Informações Gerais</Text>{" "}
						{data.gateway === "SDG" ? (
							<Image src={SDg} style={{ width: "80" }} />
						) : (
							<Image src={SDp} style={styles.logo} />
						)}
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Requerente:</Text>
						<Text style={styles.value}>{data.requester}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Email:</Text>
						<Text style={styles.value}>{data.email}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Departamento:</Text>
						<Text style={styles.value}>{data.departament}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Cliente:</Text>
						<Text style={styles.value}>{data.client}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Projeto:</Text>
						<Text style={styles.value}>{data.project}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Número do Pedido:</Text>
						<Text style={styles.value}>{data.invoiceNumber}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Número do Cliente:</Text>
						<Text style={styles.value}>{data.clientNumber}</Text>
					</View>
					<View style={{ marginTop: 10 }} />
					<View style={[styles.row]}>
						<Text style={styles.label}>Gateway:</Text>
						<Text style={[styles.value]}>{data.gateway}</Text>
					</View>
					<View style={[styles.row, styles.highligth]}>
						<Text style={styles.label}>Conexão Sigma:</Text>
						<Text style={styles.value}>{data.sigmaConnection}</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Detalhes da Aplicação</Text>
					<View style={styles.tableRow}>
						<View style={styles.tableColHeader}>
							<Text style={styles.tableCellHeader}>Entradas</Text>
						</View>
						<View style={styles.tableColHeader}>
							<Text style={styles.tableCellHeader}>Saídas</Text>
						</View>
						<View style={styles.tableColHeader}>
							<Text style={styles.tableCellHeader}>IEDs de terceiros</Text>
						</View>
					</View>
					<View style={styles.tableRow}>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>{inputProtocols.join(", ")}</Text>
						</View>
						<View style={[styles.tableCol]}>
							<Text style={[styles.tableCell, styles.highligthYellow]}>{outputProtocols.join(", ")}</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={[styles.tableCell, styles.highligthBlue]}>
								{thirdPartIeds.length > 0
									? thirdPartIeds.map((ied, index) => {
											return " " +ied.nome;
										})
									: "Nenhum"}
							</Text>
						</View>
					</View>
				</View>

				{comment && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Comentários</Text>
						<Text style={styles.value}>{comment}</Text>
					</View>
				)}

				<Text
					style={styles.footer}
					render={({ pageNumber, totalPages }) =>
						`${pageNumber} / ${totalPages}`
					}
					fixed
				/>
			</Page>

			{/* Page 2: Inputs */}
			{data.entradas && data.entradas.length > 0 && (
				<Page size="A4" style={styles.page}>
					<View style={styles.header} fixed>
						<Image src={logo} style={styles.logo} />
						<Text style={styles.title}>Detalhes das Entradas</Text>
					</View>
					<View style={styles.section}>
						{data.entradas.map((entrada: any, index: number) => (
							<View key={index} style={styles.subsection} break={index > 0}>
								<Text style={[styles.subsectionTitle, {color: "#008242"}]}>Entrada {index + 1}</Text>
								<View style={styles.row}>
									<Text style={styles.label}>Tipo:</Text>
									<Text style={styles.value}>{entrada.type}</Text>
								</View>
								<View style={[styles.row, styles.highligthYellow]}>
									<Text style={styles.label}>Protocolo:</Text>
									<Text style={styles.value}>{entrada.protocolo}</Text>
								</View>
								{entrada.ip && entrada.port ? (
									<>
										<View style={styles.row}>
											<Text style={styles.label}>IP:</Text>
											<Text style={styles.value}>{entrada.ip}</Text>
										</View>
										<View style={styles.row}>
											<Text style={styles.label}>Porta:</Text>
											<Text style={styles.value}>{entrada.port}</Text>
										</View>
									</>
								) : (
									<>
										<View style={styles.row}>
											<Text style={styles.label}>Baud Rate:</Text>
											<Text style={styles.value}>{entrada.baudRate}</Text>
										</View>
										<View style={styles.row}>
											<Text style={styles.label}>Data Bits:</Text>
											<Text style={styles.value}>{entrada.dataBits}</Text>
										</View>
										<View style={styles.row}>
											<Text style={styles.label}>Paridade:</Text>
											<Text style={styles.value}>{entrada.parity}</Text>
										</View>
										<View style={styles.row}>
											<Text style={styles.label}>Stop Bits:</Text>
											<Text style={styles.value}>{entrada.stopBits}</Text>
										</View>
									</>
								)}
								{entrada.ieds && entrada.ieds.length > 0 && (
									<View style={styles.iedTable}>
										<View style={styles.iedTableRow}>
											<Text
												style={[
													styles.iedTableCell,
													{ width: "25%", fontWeight: "bold" },
												]}
											>
												Nome
											</Text>
											<Text
												style={[
													styles.iedTableCell,
													{ width: "25%", fontWeight: "bold" },
												]}
											>
												Fabricante
											</Text>
											<Text
												style={[
													styles.iedTableCell,
													{ width: "15%", fontWeight: "bold" },
												]}
											>
												Endereço
											</Text>
											<Text
												style={[
													styles.iedTableCell,
													{ width: "20%", fontWeight: "bold" },
												]}
											>
												Módulos
											</Text>
											<Text
												style={[
													styles.iedTableCell,
													{ width: "15%", fontWeight: "bold" },
												]}
											>
												Opcional
											</Text>
										</View>
										{entrada.ieds.map((ied: any, iedIndex: number) => (
											<View key={iedIndex} style={styles.iedTableRow}>
												<Text style={[styles.iedTableCell, { width: "25%" }]}>
													{ied.name}
												</Text>
												<Text style={ied.manufacturer === "Treetech" ? [styles.iedTableCell, styles.highligth, { width: "25%" }] : [styles.iedTableCell, styles.highligthBlue, { width: "25%" }]} >
													{ied.manufacturer}
												</Text>
												<Text style={[styles.iedTableCell, { width: "15%" }]}>
													{ied.address}
												</Text>
												<Text style={[styles.iedTableCell, { width: "20%" }]}>
													{ied.modules}
												</Text>
												<Text style={[styles.iedTableCell, { width: "15%" }]}>
													{ied.optional}
												</Text>
											</View>
										))}
									</View>
								)}
							</View>
						))}
					</View>
					<Text
						style={styles.footer}
						render={({ pageNumber, totalPages }) =>
							`${pageNumber} / ${totalPages}`
						}
						fixed
					/>
				</Page>
			)}

			{/* Page 3: Outputs */}
			{data.saidas && data.saidas.length > 0 && (
				<Page size="A4" style={styles.page}>
					<View style={styles.header} fixed>
						<Image src={logo} style={styles.logo} />
						<Text style={styles.title}>Detalhes das Saídas</Text>
					</View>
					<View style={styles.section}>
						{data.saidas.map((saida: any, index: number) => (
							<View key={index} style={styles.subsection} break={index > 0}>
								<Text style={[styles.subsectionTitle, {color: "#008242"}]}>Saída {index + 1}</Text>
								<View style={styles.row}>
									<Text style={styles.label}>Tipo:</Text>
									<Text style={styles.value}>{saida.type}</Text>
								</View>
								<View style={[styles.row, styles.highligthYellow]}>
									<Text style={styles.label}>Protocolo:</Text>
									<Text style={styles.value}>{saida.protocolo}</Text>
								</View>
								{saida.ip && saida.port ? (
									<>
										<View style={styles.row}>
											<Text style={styles.label}>IP:</Text>
											<Text style={styles.value}>{saida.ip}</Text>
										</View>
										<View style={styles.row}>
											<Text style={styles.label}>Porta:</Text>
											<Text style={styles.value}>{saida.port}</Text>
										</View>
									</>
								) : (
									<>
										<View style={styles.row}>
											<Text style={styles.label}>Baud Rate:</Text>
											<Text style={styles.value}>{saida.baudRate}</Text>
										</View>
										<View style={styles.row}>
											<Text style={styles.label}>Data Bits:</Text>
											<Text style={styles.value}>{saida.dataBits}</Text>
										</View>
										<View style={styles.row}>
											<Text style={styles.label}>Paridade:</Text>
											<Text style={styles.value}>{saida.parity}</Text>
										</View>
										<View style={styles.row}>
											<Text style={styles.label}>Stop Bits:</Text>
											<Text style={styles.value}>{saida.stopBits}</Text>
										</View>
									</>
								)}
								{saida.ieds && saida.ieds.length > 0 && (
									<View style={styles.iedTable}>
										<View style={styles.iedTableRow}>
											<Text
												style={[
													styles.iedTableCell,
													{ width: "25%", fontWeight: "bold" },
												]}
											>
												Nome
											</Text>
											<Text
												style={[
													styles.iedTableCell,
													{ width: "25%", fontWeight: "bold" },
												]}
											>
												Fabricante
											</Text>
											<Text
												style={[
													styles.iedTableCell,
													{ width: "15%", fontWeight: "bold" },
												]}
											>
												Endereço
											</Text>
											<Text
												style={[
													styles.iedTableCell,
													{ width: "20%", fontWeight: "bold" },
												]}
											>
												Módulos
											</Text>
											<Text
												style={[
													styles.iedTableCell,
													{ width: "15%", fontWeight: "bold" },
												]}
											>
												Opcional
											</Text>
										</View>
										{saida.ieds.map((ied: any, iedIndex: number) => (
											<View key={iedIndex} style={styles.iedTableRow}>
												<Text style={[styles.iedTableCell, { width: "25%" }]}>
													{ied.name}
												</Text>
												<Text style={ied.manufacturer === "Treetech" ? [styles.iedTableCell, styles.highligth, { width: "25%" }] : [styles.iedTableCell, styles.highligthBlue, { width: "25%" }]} >
													{ied.manufacturer}
												</Text>
												<Text style={[styles.iedTableCell, { width: "15%" }]}>
													{ied.address}
												</Text>
												<Text style={[styles.iedTableCell, { width: "20%" }]}>
													Idem à Entrada
												</Text>
												<Text style={[styles.iedTableCell, { width: "15%" }]}>
													Idem à Entrada
												</Text>
											</View>
										))}
									</View>
								)}
							</View>
						))}
					</View>
					<Text
						style={styles.footer}
						render={({ pageNumber, totalPages }) =>
							`${pageNumber} / ${totalPages}`
						}
						fixed
					/>
				</Page>
			)}
		</Document>
	);
};
