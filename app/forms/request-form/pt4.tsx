import { Button } from "@/components/ui/button"
import { useRequestStore } from "./store";
import { ChevronLeft } from "lucide-react";
import { requestFormSchema } from "./types";
import type z from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea"
import { useEffect } from "react";
import { pdf } from '@react-pdf/renderer';
import { MyDocument } from "./pdf-document";


interface Props {
    isHidden: boolean
    next?: () => void
    prev?: () => void

}

const commentsSchema = requestFormSchema.pick({
    comments: true,
});
type Comment = z.infer<typeof commentsSchema>;

export default function Pt4({ isHidden, next, prev }: Props) {
    const storedData = useRequestStore((state) => state);
    const storeData = useRequestStore((state) => state.setData);


    const {
        control,
        handleSubmit,
        watch,
        ...form
    } = useForm<Comment>({
        // resolver: zodResolver(),
        defaultValues: {
            comments: storedData.comments || "",
        },
    });

    const watchedComment = watch("comments");
    useEffect(() => {
       storeData({ comments: watchedComment || ""});
    }, [watchedComment, storeData]);


    const saveFormData = async (data: Comment) => {
        storeData(data);
        const blob = await pdf(<MyDocument data={storedData} comment={data.comments || ""} />).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'requisicao.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    return (
        <div className="p-2 gap-2" style={isHidden ? { display: "none" } : {}}>

            <form onSubmit={handleSubmit(saveFormData)}>
                <h1 className="text-lg font-bold">Anotações e comentários</h1>

                <Textarea {...form.register("comments")} placeholder="Coloque aqui seus comentários para a equipe do SAM a respeito de algum IED ou sobre a aplicação" />

                <footer className="flex gap-1 justify-between mt-5">
                    {prev ? (
                        <Button type="button" onClick={prev}>
                            <ChevronLeft />
                        </Button>
                    ) : (
                        <Button className="invisible"></Button>
                    )}

                    <Button type="submit">
                        Gerar PDF
                    </Button>
                </footer>
            </form>


        </div>
    )

}