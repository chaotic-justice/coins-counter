import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Calculator } from 'lucide-react';
import { useBillCounter } from '@/lib/useBillCounter';
import BillCounterForm from './form';
import BillCounterResults from './result';
import { coinsService } from '@/services/api';
import { useTranslations } from 'gt-react';
import { canDistributeBillsEvenlyDP } from '@/lib/algo';
import { useState } from 'react';
import type { StackStats } from '@/types/api';

const BillCounter: React.FC = () => {
  const d = useTranslations();
  const { form, calculateTotal, resetForm } = useBillCounter();
  const [results, setResults] = useState<ReturnType<typeof calculateTotal> | null>(null);
  const [stackStats, setStackStats] = useState<StackStats[] | null>(null)

  const onSubmit = async (data: Parameters<typeof calculateTotal>[0]) => {
    const input = {
      five: data[5],
      ten: data[10],
      twenty: data[20],
      fifty: data[50],
      hundred: data[100],
    }
    const evenly = canDistributeBillsEvenlyDP(input)
    console.log('evenly', evenly)
    const calc = calculateTotal(data);
    if (evenly.isDivisibleByThree && evenly.canBeEvenlyDistributed) {
      const res = await coinsService.post('/bills/perfect', data)
      console.log('res', res)
      setStackStats(res)
    } else {
      console.log('bad requeast')
      console.log('calc', calc)
    }
  };

  // Get form values and watch for changes
  const formValues = form.watch();
  const isDirty = form.formState.isDirty;

  // Use ref to track previous values and avoid unnecessary calculations
  const previousValuesRef = React.useRef(formValues);
  const calculationTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Auto-calculate when form becomes dirty and has values
  React.useEffect(() => {
    // Clear any existing timeout
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current);
    }

    // Only calculate if form is dirty and values have actually changed
    const valuesChanged = JSON.stringify(previousValuesRef.current) !== JSON.stringify(formValues);

    if (isDirty && valuesChanged) {
      // Debounce the calculation to avoid excessive computations during rapid typing
      calculationTimeoutRef.current = setTimeout(() => {
        const calculatedResults = calculateTotal(formValues);
        setResults(calculatedResults);
        previousValuesRef.current = formValues;
      }, 150); // 150ms debounce delay
    }

    // Cleanup timeout on unmount
    return () => {
      if (calculationTimeoutRef.current) {
        clearTimeout(calculationTimeoutRef.current);
      }
    };
  }, [formValues, isDirty, calculateTotal]); // Remove calculateTotal from dependencies

  const handleReset = () => {
    resetForm();
    setResults(null);
    previousValuesRef.current = { 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 };
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              {d("header.appName")}
            </CardTitle>
            <CardDescription>
              {d("counter.description")}
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {d('commons.reset')}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BillCounterForm form={form} />

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {d('counter.form.splitBtn')}
              </Button>
            </div>
          </form>
        </Form>

        {results && stackStats && <BillCounterResults results={results} stackStats={stackStats} />}
      </CardContent>
    </Card>
  );
};

export default BillCounter;