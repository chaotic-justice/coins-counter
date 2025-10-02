import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Calculator } from 'lucide-react';
import { useBillCounter } from '@/lib/useBillCounter';
import BillCounterForm from './form';
import BillCounterResults from './result';

const BillCounter: React.FC = () => {
  const { form, calculateTotal, resetForm } = useBillCounter();
  const [results, setResults] = React.useState<ReturnType<typeof calculateTotal> | null>(null);

  const onSubmit = (data: Parameters<typeof calculateTotal>[0]) => {
    const calculatedResults = calculateTotal(data);
    setResults(calculatedResults);
  };

  const handleReset = () => {
    resetForm();
    setResults(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Bills Counter
            </CardTitle>
            <CardDescription>
              Enter the number of bills to calculate the total amount
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BillCounterForm form={form} />

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Calculate Total
              </Button>
            </div>
          </form>
        </Form>

        {results && <BillCounterResults results={results} />}
      </CardContent>
    </Card>
  );
};

export default BillCounter;