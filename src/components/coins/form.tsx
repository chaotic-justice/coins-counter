import React from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type BillCounterFormData } from '@/schemas/billCounter';

interface BillCounterFormProps {
  form: UseFormReturn<BillCounterFormData>;
}

const BILL_DENOMINATIONS = [
  { value: 100, label: '$100 Bills', field: 'hundreds' as const },
  { value: 50, label: '$50 Bills', field: 'fifties' as const },
  { value: 20, label: '$20 Bills', field: 'twenties' as const },
  { value: 10, label: '$10 Bills', field: 'tens' as const },
  { value: 5, label: '$5 Bills', field: 'fives' as const },
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
                <Input
                  {...field}
                  type="number"
                  min="0"
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  className="text-lg font-medium"
                />
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