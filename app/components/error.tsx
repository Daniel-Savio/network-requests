import { CircleX } from "lucide-react";

interface Props{
    message: string | undefined
}
export default function InputError({message}: Props) {
    
  return (
    <span className="text-xs mt-2 text-destructive flex gap-1 items-center"><CircleX size={12}/> {message}</span>
  )
}
