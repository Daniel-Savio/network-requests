import * as z from 'zod'


export interface Employee {
    name: string
    email: string
    departament: string
}

export interface IedTerceiros {
    nome: string
    fabricante: string
}

const itemSchema = z.object({
    protocolo: z.string().nonempty('Campo obrigatório'),
    type: z.string(),
    ip: z.string().optional(),
    port: z.string().optional(),
    config: z.string().optional(),
    baudRate: z.string().optional(),
    dataBits: z.string().optional(),
    parity: z.string().optional(),
    stopBits: z.string().optional(),
    ieds: z
        .array(
            z.object({
                name: z.string(),
                manufacturer: z.string(),
                address: z.string(),
                modules: z.string().optional(),
                optional: z.string().optional(),

            })
        )
        .optional(),
})

export const requestFormSchema = z.object({
    requester: z
        .string('Insira um nome válido e envie novamente')
        .min(3, 'Insira um nome válido')
        .nonempty('Campo obrigatório'),
    email: z
        .string('Insira um e-mail válido e envie novamente')
        .email('Insira um e-mail válido')
        .nonempty('Campo obrigatório'),
    departament: z
        .string('Insira um departamento válido e envie novamente')
        .min(3, 'Insira um departamento válido')
        .nonempty('Campo obrigatório'),
    isEqual: z.boolean('Escolha uma opção e envie novamente').optional(),
    client: z.string().min(3, 'Insira um nome válido'),
    project: z.string().min(3, 'Insira um nome válido'),
    invoiceNumber: z.string().regex(/^\d+$/, 'Insira um número de pedido válido'),
    clientNumber: z.string().regex(/^\d+$/, 'Insira um número de cliente válido'),
    gateway: z.string('Escolha o Gateway'),
    entradas: z.array(itemSchema).optional(),
    saidas: z.array(itemSchema, 'Insira ao menos uma saída'),
    sigmaConnection: z.string('Escolha uma opção e envie novamente'),
    comments: z.string().optional(),
})

export type RequestForm = z.infer<typeof requestFormSchema>
export type Entrada = z.infer<typeof itemSchema>
export type Saida = z.infer<typeof itemSchema>
export type IED = NonNullable<z.infer<typeof itemSchema>['ieds']>[number]