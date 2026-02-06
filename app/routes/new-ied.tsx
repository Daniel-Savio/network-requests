import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ApprovalForm from '@/forms/approval-form/approval-form';


// --- 3. Componente Principal ---
export default function NewIed() {
  return (
		<div className="max-h-screen">
			<ScrollArea className="flex flex-row">
				<Card className="m-auto md:max-w-250">
					<CardHeader>
						<h1 className="text-lg font-bold">Homologação e Mapeamento</h1>
						<div className="flex justify-between">
							<h1>Dados para Homologação</h1>
						</div>
						
					</CardHeader>
					<CardContent className="p-2">
						<ApprovalForm></ApprovalForm>
					</CardContent>
				</Card>
			</ScrollArea>
		</div>
	);
}