import { QuizFlow } from './components/QuizFlow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function QuizPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">KBC Style Quiz Challenge</CardTitle>
          <CardDescription className="text-lg text-foreground/80 mt-2">
            Test your knowledge and climb the ladder to victory!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuizFlow />
        </CardContent>
      </Card>
    </div>
  );
}
