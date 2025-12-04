import { CircleX } from "lucide-react";

interface Props{
    message: string | undefined
}
export default function InputError({message}: Props) {
    
  return (
    <span className="text-xs text-destructive flex gap-1 items-center"><CircleX size={12}/> {message}</span>
  )
}
