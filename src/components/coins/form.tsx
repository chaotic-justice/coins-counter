import React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type BillCounterFormData } from '@/schemas/billCounter';
import { Button } from '../ui/button';
import { Minus, Plus } from 'lucide-react';

interface BillCounterFormProps {
  form: UseFormReturn<BillCounterFormData>;
}

const BILL_DENOMINATIONS = [
  { value: 100, label: '$100 Bills', field: '100' as const },
  { value: 50, label: '$50 Bills', field: '50' as const },
  { value: 20, label: '$20 Bills', field: '20' as const },
  { value: 10, label: '$10 Bills', field: '10' as const },
  { value: 5, label: '$5 Bills', field: '5' as const },
];

const BillCounterForm: React.FC<BillCounterFormProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {BILL_DENOMINATIONS.map((denom) => (
        <FormField
          key={denom.value}
          control={form.control}
          name={denom.field}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">{denom.label}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault()
                      const newValue = field.value - 1;
                      field.onChange(newValue);
                    }}
                    disabled={field.value === 0}
                    className="w-10 h-10 shrink-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                <Input
                  {...field}
                  value={field.value.toString()}
                  type="number"
                  min="0"
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className="font-mono text-lg text-center"
                />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault()
                      const newValue = field.value + 1;
                      field.onChange(newValue);
                    }}
                    className="w-10 h-10 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};

export default BillCounterForm;