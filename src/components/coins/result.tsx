import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BillCounterResult } from '@/schemas/billCounter';
import { DollarSign } from 'lucide-react';

interface BillCounterResultsProps {
  results: BillCounterResult;
}

const BillCounterResults: React.FC<BillCounterResultsProps> = ({ results }) => {
  const stacks = 3
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
          {results.total > 0 && stacks > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">Stack Details</h2>
                <span className="text-sm text-muted-foreground">
                  ({stacks} {stacks > 1 ? "stacks" : "stack"})
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[].map((stack) => (
                  <Card key={stack.stackNumber} className="shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Stack #{stack.stackNumber}</span>
                        <span className="text-success">${stack.amount.toLocaleString()}</span>
                      </CardTitle>
                      <CardDescription>
                        {stack.totalBills} {stack.totalBills === 1 ? "bill" : "bills"} total
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1.5 text-sm">
                        {stack.distribution.hundreds > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">$100 bills:</span>
                            <span className="font-medium">{stack.distribution.hundreds}</span>
                          </div>
                        )}
                        {stack.distribution.fifties > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">$50 bills:</span>
                            <span className="font-medium">{stack.distribution.fifties}</span>
                          </div>
                        )}
                        {stack.distribution.twenties > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">$20 bills:</span>
                            <span className="font-medium">{stack.distribution.twenties}</span>
                          </div>
                        )}
                        {stack.distribution.tens > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">$10 bills:</span>
                            <span className="font-medium">{stack.distribution.tens}</span>
                          </div>
                        )}
                        {stack.distribution.fives > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">$5 bills:</span>
                            <span className="font-medium">{stack.distribution.fives}</span>
                          </div>
                        )}
                        {stack.totalBills === 0 && <div className="text-muted-foreground text-center py-2">No bills</div>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* {remainingAmount > 0 && (
                <Card className="shadow-md border-warning">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Remaining amount after distribution:</span>
                      <span className="text-2xl font-bold text-warning">${remainingAmount.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              )} */}
            </div>
          )}

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