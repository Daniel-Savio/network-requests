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
import type { ApprovalFormType } from "./types";

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

export const MyDocument = (data: ApprovalFormType) => {


	return (
		<Document>
			{/* Page 1: Summary */}
			<Page size="A4" style={styles.page}>
				<View style={styles.header} fixed>
					<Image src={logo} style={styles.logo} />
					<Text style={styles.title}>Requisição de {data.approval}</Text>
				</View>

				<View style={styles.section}>

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
						<Text style={styles.label}>Protocolos:</Text>
						<Text style={styles.value}>{data.protocols}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Site de acesso:</Text>
						<Text style={styles.value}>{data.url}</Text>
					</View>
					<View style={{ marginTop: 10 }} />
				</View>

					<View style={styles.tableRow}>
						<View style={styles.tableColHeader}>
							<Text style={styles.tableCellHeader}>Fabricante</Text>
						</View>
						<View style={styles.tableColHeader}>
							<Text style={styles.tableCellHeader}>Nome do equipamento</Text>
						</View>
						<View style={styles.tableColHeader}>
							<Text style={styles.tableCellHeader}>Tipo do equipamento</Text>
						</View>
						<View style={styles.tableColHeader}>
							<Text style={styles.tableCellHeader}>Documento anexado</Text>
						</View>
					</View>
					<View style={styles.tableRow}>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>{data.manufacturer}</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>{data.name}</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>{data.type}</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>{data.documentType}</Text>
						</View>
					</View>


				{data.comments && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Comentários</Text>
						<Text style={styles.value}>{data.comments}</Text>
					</View>
				)}

				<Text
					style={styles.footer}
				>
          Essa folha apresenta informações relativas ao pedido de {data.approval}
        </Text>
			</Page>

		</Document>
	);
};