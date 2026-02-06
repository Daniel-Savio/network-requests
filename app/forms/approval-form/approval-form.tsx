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
// Certifique-se de ter instalado: npm install @react-pdf/renderer pdf-lib
import { Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';
import { PDFDocument } from 'pdf-lib';

import {
    CircleQuestionMark,
    Computer,
    Factory,
    Link2,
    Scroll,
    Shell,
    Sigma,
    Users,
    FileUp, // Adicionado ícone para upload
    Download // Adicionado ícone para botão
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
import {PDFcover} from "./pdf-cover";


// --- 1. Estilos e Componente do PDF Interno ---
const pdfStyles = StyleSheet.create({
    page: { flexDirection: 'column', padding: 40, fontFamily: 'Helvetica' },
    header: { fontSize: 18, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    section: { marginBottom: 10, padding: 10, border: '1px solid #e5e7eb', borderRadius: 4 },
    row: { flexDirection: 'row', marginBottom: 5 },
    label: { fontSize: 10, color: '#6b7280', width: '30%' },
    value: { fontSize: 10, color: '#000', width: '70%', fontWeight: 'bold' },
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, textAlign: 'center', color: '#9ca3af' }
});



export default function ApprovalForm() {
    const [importedFile, setImportedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const {
        formState: { errors },
        ...form
    } = useForm<ApprovalFormType>({
        resolver: zodResolver(approvalScheema) as any,
        defaultValues: { approval: "Mapeamento" },
    });

    const requester = form.watch("requester");

    // --- 2. Função de Upload ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImportedFile(e.target.files[0]);
        }
    };

    // --- 3. Lógica Principal (Submit + Merge) ---
    async function handleMergeAndSubmit(data: ApprovalFormType) {
        if (!importedFile) {
            alert("Por favor, anexe o documento PDF obrigatório antes de continuar.");
            return;
        }

        // Preencher dados automáticos baseados no JSON info
        const selectedRequester = info.requester.find((item) => item.name === data.requester);
        data.email = selectedRequester?.email || "";
        data.departament = selectedRequester?.departament || "";

        try {
            setIsProcessing(true);

            // A. Carregar PDF Externo
            const importedFileBuffer = await importedFile.arrayBuffer();
            const pdfDoc = await PDFDocument.load(importedFileBuffer);

            // B. Gerar PDF do React (Capa/Dados)
            const internalBlob = await pdf(<PDFcover data={data} />).toBlob();
            const internalBuffer = await internalBlob.arrayBuffer();
            const generatedPdfDoc = await PDFDocument.load(internalBuffer);

            // C. Mesclar: Inserir a capa gerada ANTES do documento importado
            // Copia todas as páginas do PDF gerado (Capa)
            const coverPages = await pdfDoc.copyPages(generatedPdfDoc, generatedPdfDoc.getPageIndices());
            
            // Adiciona as páginas da capa no início (índice 0)
            // Nota: insertPage insere, addPage coloca no final. Vamos colocar a capa no início.
            coverPages.reverse().forEach((page) => {
                pdfDoc.insertPage(0, page);
            });

            // D. Salvar e Baixar
            const mergedPdfBytes = await pdfDoc.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            // Nome do arquivo limpo
            const safeName = data.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            link.href = url;
            link.download = `solicitacao_${data.approval.toLowerCase()}_${safeName}.pdf`;
            link.click();
            URL.revokeObjectURL(url);

            console.log("Processo finalizado com os dados:", data);

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Erro ao processar o arquivo. Verifique se o PDF anexo é válido.");
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className="p-2 gap-2">
            <h1 className="text-lg font-bold">Informações Gerais</h1>

            <form
                onSubmit={form.handleSubmit(handleMergeAndSubmit)}
                className="flex flex-col gap-4"
            >
                {/* ... (Seus campos anteriores mantidos intactos) ... */}
                
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

                {/* Cliente */}
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
                                        <SelectItem value="Modbus, DNP3 e IEC61850">Modbus, DNP3 e IEC61850</SelectItem>
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



                {/* --- LÓGICA DE INPUT DE ARQUIVO INSERIDA AQUI --- */}
                <div className="space-y-2 mt-2 ">
                    <Label className={!importedFile ? "text-red-500 font-bold" : ""}>
                        Documentação do IED
                    </Label>
                    <InputGroup className="hover:bg-zinc-200 transition-all">
                         {/* Input 'mascarado' para manter o estilo do InputGroup se desejar, ou usar um input file nativo estilizado */}
                        <div className="relative w-full flex items-center ">
                            <input 
                                type="file" 
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            <InputGroupInput
                                readOnly
                                value={importedFile ? importedFile.name : ""}
                                placeholder="Clique para selecionar o PDF..."
                                className="cursor-pointer"
                            />
                        </div>
                        <InputGroupAddon>
                            <FileUp />
                        </InputGroupAddon>
                    </InputGroup>
                    {!importedFile && (
                        <p className="text-xs text-red-500">A importação do PDF é obrigatória.</p>
                    )}
                </div>

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


                <Textarea {...form.register("comments")} placeholder="Coloque aqui seus comentários para a equipe do SAM a respeito desse mapeamento ou homologação do IED" />

                {/* --- BOTÃO DE SUBMIT ADICIONADO --- */}
                <Button 
                    type="submit" 
                    className="w-full mt-4 gap-2" 
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        "Processando PDF..."
                    ) : (
                        <>
                            <Download size={18} />
                            Gerar e Baixar Solicitação Unificada
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}