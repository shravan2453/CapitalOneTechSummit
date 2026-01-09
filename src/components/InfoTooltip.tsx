import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  title?: string;
  size?: number;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, title, size = 16 }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-cap-red hover:text-cap-redDark transition-colors"
        aria-label="More information"
      >
        <HelpCircle size={size} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-80 rounded-lg border border-cap-red/20 p-4 z-50"
            style={{
              background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
              boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(200, 16, 46, 0.2), 0 4px 8px rgba(200, 16, 46, 0.15), 0 0 0 1px rgba(200, 16, 46, 0.1)'
            }}
          >
            <div className="flex justify-between items-start mb-2">
              {title && <h4 className="font-bold text-gray-900 text-sm">{title}</h4>}
              <button
                onClick={() => setIsOpen(false)}
                className="text-cap-red hover:text-cap-redDark ml-2"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{content}</p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        </>
      )}
    </div>
  );
};

// Educational content database
export const educationalContent = {
  deferment: {
    title: 'What is Deferment?',
    content: 'Deferment allows you to postpone loan payments while in school. However, interest continues to accrue on unsubsidized loans, increasing your total cost over time.'
  },
  interestOnly: {
    title: 'Interest-Only Payments',
    content: 'Paying interest while in school prevents it from capitalizing (being added to your principal). This reduces your total loan cost compared to full deferment.'
  },
  incomeDriven: {
    title: 'Income-Driven Repayment Plans',
    content: 'These plans base your monthly payment on your income and family size, typically 10-20% of discretionary income. Payments may be lower but extend the repayment period, potentially increasing total interest.'
  },
  subsidized: {
    title: 'Subsidized vs Unsubsidized',
    content: 'Subsidized loans: Government pays interest while in school. Unsubsidized loans: Interest accrues immediately. Subsidized loans are need-based and typically have lower limits.'
  },
  originationFee: {
    title: 'Origination Fee',
    content: 'A one-time fee charged when the loan is disbursed, deducted from the loan amount. For example, a 1.057% fee on a $10,000 loan means you receive $9,894.30.'
  },
  gracePeriod: {
    title: 'Grace Period',
    content: 'The period after graduation or leaving school before repayment begins. Typically 6 months for federal loans. Interest may still accrue during this time.'
  }
};
