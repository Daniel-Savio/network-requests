import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import P1 from "@/forms/request-form/pt1";
import P2 from "@/forms/request-form/pt2";
import P3 from "@/forms/request-form/pt3";
import P4 from "@/forms/request-form/pt4";
import { useRequestStore } from "@/forms/request-form/store";
import { useState } from "react";
import emptyData from "@/lib/emptyData.json";
import {
	requestFormSchema,
	type RequestForm,
} from "@/forms/request-form/types";
import { ArrowLeftToLine, Download, Trash, Upload } from "lucide-react";

export default function Request() {
	const [formStep, setFormStep] = useState(0);
	const clearData = useRequestStore((state) => state.setData);

	return (
		<div className="max-h-screen">
			<ScrollArea className="">
				<Card className="m-auto md:max-w-250">
					<CardHeader>
						<h1 className="text-lg font-bold">Requisição</h1>
						<div className="flex justify-between">
							<h1>Progresso do formulário</h1>
							<div className="flex gap-2">
								{formStep !== 0 && (
									<Button onClick={()=>{setFormStep(0)}}>
										<ArrowLeftToLine />
									</Button>
								)
                                }
								<Button
									type="button"
									variant="destructive"
									size="sm"
									className=""
									onClick={() => {
										clearData(emptyData);
										window.location.reload();
									}}
								>
									<Trash />
									Limpar
								</Button>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="ml-2"
									onClick={exportTemplate}
								>
									<Download />
									Baixar
								</Button>
								<input
									type="file"
									accept=".json"
									onChange={importTemplate}
									className="hidden"
									id="import-template-input"
								/>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="ml-2"
									onClick={() =>
										document.getElementById("import-template-input")?.click()
									}
								>
									<Upload />
									Importar
								</Button>
							</div>
						</div>
						<Progress value={(formStep + 1) * 25} />
					</CardHeader>
					<CardContent className="p-2">
						<P1
							isHidden={formStep !== 0}
							next={() => {
								setFormStep(1);
							}}
						/>
						<P2
							isHidden={formStep !== 1}
							next={() => {
								setFormStep(2);
							}}
							prev={() => {
								setFormStep(0);
							}}
						/>
						<P3
							isHidden={formStep !== 2}
							next={() => {
								setFormStep(3);
							}}
							prev={() => {
								setFormStep(1);
							}}
						/>
						<P4
							isHidden={formStep !== 3}
							prev={() => {
								setFormStep(2);
							}}
						/>
					</CardContent>
				</Card>
			</ScrollArea>
		</div>
	);

	function exportTemplate() {
		const currentData = useRequestStore.getState();
		const filename = "request_template.json";
		const jsonStr = JSON.stringify(currentData, null, 2);

		const link = document.createElement("a");
		link.href = URL.createObjectURL(
			new Blob([jsonStr], { type: "application/json" }),
		);
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function importTemplate(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const importedData = JSON.parse(e.target?.result as string);
				const sourceData = importedData.state
					? importedData.state
					: importedData;
				const formKeys = Object.keys(requestFormSchema.shape);
				const filteredData: Partial<RequestForm> = {};

				for (const key of formKeys) {
					if (Object.prototype.hasOwnProperty.call(sourceData, key)) {
						filteredData[key as keyof RequestForm] = sourceData[key];
					}
				}

				clearData(filteredData);
				window.location.reload();
			} catch (error) {
				console.error("Failed to parse imported template:", error);
				alert(
					"Erro ao importar o template. Verifique se o arquivo é um JSON válido.",
				);
			}
		};
		reader.readAsText(file);
	}
}
