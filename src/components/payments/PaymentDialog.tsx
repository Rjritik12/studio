
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IndianRupee, CreditCard, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemPrice: number;
  currencySymbol?: string;
  onPaymentSuccessMock?: () => void;
}

export function PaymentDialog({
  isOpen,
  onClose,
  itemName,
  itemPrice,
  currencySymbol = "₹",
  onPaymentSuccessMock,
}: PaymentDialogProps) {
  const [activeTab, setActiveTab] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleMockPayment = async (event: FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsProcessing(false);
    toast({
      title: "Mock Payment Successful!",
      description: `Your purchase of ${itemName} for ${currencySymbol}${itemPrice} was simulated.`,
      variant: "default",
      className: "bg-green-500 text-white dark:bg-green-700 dark:text-white"
    });
    onPaymentSuccessMock?.();
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setUpiId('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
    setActiveTab('upi');
  }

  const handleDialogClose = () => {
    if (!isProcessing) {
      resetForm();
      onClose();
    }
  }
  
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  }

  const formatExpiryDate = (value: string) => {
    let v = value.replace(/\D/g, '');
    if (v.length > 2) {
      v = v.substring(0,2) + '/' + v.substring(2,4);
    }
    return v;
  }


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline flex items-center">
            Complete Your Mock Payment
          </DialogTitle>
          <DialogDescription>
            You are purchasing: <span className="font-semibold text-primary">{itemName}</span> for <span className="font-semibold text-primary">{currencySymbol}{itemPrice}</span>.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upi' | 'card')} className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upi"><IndianRupee className="mr-2 h-4 w-4 inline-block" /> UPI</TabsTrigger>
            <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4 inline-block" /> Card</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleMockPayment}>
            <TabsContent value="upi" className="space-y-4 pt-4">
              <div className="space-y-1">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input 
                  id="upiId" 
                  placeholder="yourname@bank" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required 
                  disabled={isProcessing}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isProcessing || !upiId.trim()}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & Pay {currencySymbol}{itemPrice} (Mock)
              </Button>
            </TabsContent>

            <TabsContent value="card" className="space-y-4 pt-4">
              <div className="space-y-1">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input 
                  id="cardholderName" 
                  placeholder="Full Name" 
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  required 
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="0000 0000 0000 0000" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19} // 16 digits + 3 spaces
                  required 
                  disabled={isProcessing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="expiryDate">Expiry (MM/YY)</Label>
                  <Input 
                    id="expiryDate" 
                    placeholder="MM/YY" 
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    maxLength={5}
                    required 
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv" 
                    placeholder="123" 
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0,3))}
                    maxLength={3}
                    required 
                    disabled={isProcessing}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isProcessing || !cardholderName.trim() || !cardNumber.trim() || cardNumber.length < 19 || !expiryDate.match(/^\d{2}\/\d{2}$/) || !cvv.match(/^\d{3}$/) }>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Pay {currencySymbol}{itemPrice} (Mock)
              </Button>
            </TabsContent>
          </form>
        </Tabs>

        <Alert variant="destructive" className="mt-6 bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-900/30 dark:border-amber-600 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="font-semibold">Mock Payment System</AlertTitle>
          <AlertDescription>
            This is a simulated payment interface. No real payment will be processed, and no actual financial data is stored or transmitted.
          </AlertDescription>
        </Alert>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleDialogClose} disabled={isProcessing}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
