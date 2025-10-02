import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BillCounterResult } from '@/schemas/billCounter';
import { DollarSign } from 'lucide-react';

interface BillCounterResultsProps {
  results: BillCounterResult;
}

const BillCounterResults: React.FC<BillCounterResultsProps> = ({ results }) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Calculation Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Breakdown */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {results.breakdown.map((item) => (
              <div
                key={item.denomination}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span className="font-medium">${item.denomination}</span>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary">× {item.count}</Badge>
                  <span className="font-semibold">${item.subtotal}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/10">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-primary">
              ${results.total.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillCounterResults;