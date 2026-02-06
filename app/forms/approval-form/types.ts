import * as z from 'zod'

export const approvalScheema = z.object({
    approval: z.string().default("Mapeamento"),
    requester: z
        .string('Insira um nome válido e envie novamente')
        .min(3, 'Insira um nome válido')
        .nonempty('Campo obrigatório'),
    email: z.string().optional(),
    departament: z.string().optional(),
    client: z.string().min(3, 'Insira um nome válido'),
    manufacturer: z.string().min(3, 'Insira o nome do fabricante do IED'),
    url: z.url('Insira uma URL válida'),
    name: z.string().min(2, 'Insira o nome do IED'),
    type: z.string().min(3, "Coloque o tipo do equipamento. Ex.: Medidor de gás, secador, monitor de bucha, etc."),
    documentType: z.string().min(3, 'Insira o tipo de documento anexado. Ex.: Manuel, Mapa de protocolo, etc'),
    protocols: z.string().nonempty('Insira ao menos um protocolo'),
    comments: z.string().optional(),
})

export type ApprovalFormType = z.infer<typeof approvalScheema>