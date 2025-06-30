import React, { useState } from 'react';
import { CreditCard, Lock, Check, ArrowLeft, Calendar, User, DollarSign } from 'lucide-react';
import type { Course, Purchase } from '../../types';

interface PaymentInterfaceProps {
  course: Course;
  onPaymentComplete: (purchase: Purchase) => void;
  onCancel: () => void;
}

export default function PaymentInterface({ course, onPaymentComplete, onCancel }: PaymentInterfaceProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('billing.')) {
      const billingField = field.split('.')[1];
      setPaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [billingField]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const purchase: Purchase = {
        id: Date.now().toString(),
        userId: '1',
        courseId: course.id,
        courseName: course.title,
        amount: course.price,
        currency: course.currency,
        purchaseDate: new Date().toISOString(),
        paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'PayPal',
        status: 'completed'
      };

      onPaymentComplete(purchase);
      setIsProcessing(false);
    }, 3000);
  };

  const tax = course.price * 0.1; // 10% tax
  const total = course.price + tax;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Course Summary */}
            <div className="lg:w-2/5 bg-gradient-to-br from-blue-900/50 to-purple-900/50 p-8">
              <button
                onClick={onCancel}
                className="flex items-center space-x-2 text-gray-300 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Course</span>
              </button>

              <div className="mb-6">
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title}
                  className="w-full aspect-video object-cover rounded-xl mb-4"
                />
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{course.description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <User className="w-4 h-4" />
                  <span>by {course.instructorName}</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-700 pt-6">
                <div className="flex justify-between text-gray-300">
                  <span>Course Price</span>
                  <span>${course.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white border-t border-gray-700 pt-3">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-xs text-gray-400">Your payment information is encrypted and secure. 30-day money-back guarantee.</p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:w-3/5 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Complete Your Purchase</h2>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border rounded-xl transition-colors flex items-center justify-center space-x-2 ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 border rounded-xl transition-colors flex items-center justify-center space-x-2 ${
                      paymentMethod === 'paypal'
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <DollarSign className="w-5 h-5" />
                    <span>PayPal</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {paymentMethod === 'card' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardholderName}
                        onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={paymentData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={paymentData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={paymentData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Billing Address */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Billing Address</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={paymentData.billingAddress.street}
                      onChange={(e) => handleInputChange('billing.street', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                      placeholder="Street Address"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={paymentData.billingAddress.city}
                        onChange={(e) => handleInputChange('billing.city', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                        placeholder="City"
                        required
                      />
                      <input
                        type="text"
                        value={paymentData.billingAddress.state}
                        onChange={(e) => handleInputChange('billing.state', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                        placeholder="State"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={paymentData.billingAddress.zipCode}
                        onChange={(e) => handleInputChange('billing.zipCode', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                        placeholder="ZIP Code"
                        required
                      />
                      <input
                        type="text"
                        value={paymentData.billingAddress.country}
                        onChange={(e) => handleInputChange('billing.country', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                        placeholder="Country"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed shadow-lg flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Complete Purchase - ${total.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}