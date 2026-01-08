import React from 'react';
import { Card, Button, PageHeader } from '../components/shared';
import { Wallet, Calendar, Percent, ArrowDown } from 'lucide-react';
import {useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'


const DashboardPage: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const {data} = await supabase.auth.getUser();
      if (data?.user){
        setUserName(data.user.user_metadata?.full_name || data.user.email);
      }
    }
    loadUser();
  }, []);
  
  
  return (
  <div className="animate-enter">
    <PageHeader 
      title="Financial Overview" 
      subtitle={`Welcome back${userName? `, ${userName}`: ''}. Your loan optimization is on track.`}
      action={<Button variant="primary" icon="download">Download Report</Button>}
    />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card highlight>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Balance</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 break-words">$42,500.00</h2>
            </div>
            <div 
              className="p-2 rounded-lg shrink-0 ml-2 border border-cap-red/20"
              style={{
                background: 'linear-gradient(145deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
              }}
            >
              <Wallet size={20} className="text-cap-red" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span 
              className="px-2 py-0.5 rounded font-medium flex items-center gap-1 whitespace-nowrap border border-cap-red/20 text-cap-red"
              style={{
                background: 'linear-gradient(145deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
              }}
            >
              <ArrowDown size={12}/> 2.4%
            </span>
            <span className="text-gray-600">since last month</span>
          </div>
        </Card>
        
        <Card highlight>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Next Payment</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 break-words">$348.50</h2>
            </div>
            <div 
              className="p-2 rounded-lg shrink-0 ml-2 border border-cap-red/20"
              style={{
                background: 'linear-gradient(145deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
              }}
            >
              <Calendar size={20} className="text-cap-red" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-gray-600">Due on <span className="font-bold text-gray-900">Nov 14, 2023</span></span>
          </div>
        </Card>
        
        <Card highlight>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Interest Rate</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 break-words">5.2%</h2>
            </div>
            <div 
              className="p-2 rounded-lg shrink-0 ml-2 border border-cap-red/20"
              style={{
                background: 'linear-gradient(145deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
              }}
            >
              <Percent size={20} className="text-cap-red" />
            </div>
          </div>
          <div className="h-1.5 rounded-full mt-3 overflow-hidden border border-cap-red/20" style={{
            background: 'linear-gradient(90deg, #F3F4F6 0%, #E5E7EB 100%)',
            boxShadow: 'inset 0 1px 2px rgba(200, 16, 46, 0.1)'
          }}>
            <div className="h-full w-2/3 rounded-full bg-cap-red" style={{
              boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(200, 16, 46, 0.3)'
            }}></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">Payoff Trajectory</h3>
              <select className="text-xs border border-cap-red/20 rounded-lg px-3 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cap-red/20 w-full sm:w-auto" style={{
                background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
              }}>
                <option>Standard Plan</option>
                <option>Aggressive</option>
              </select>
            </div>
            <div className="h-48 sm:h-64 flex items-end justify-between gap-2 sm:gap-3 px-2 overflow-x-auto">
              {[65, 62, 58, 55, 50, 48, 45, 42, 38, 35, 30, 25].map((h, i) => (
                <div key={i} className="flex-1 min-w-[20px] rounded-t-lg relative group overflow-hidden border border-cap-red/20" style={{
                  height: `${h}%`,
                  background: 'linear-gradient(180deg, #F3F4F6 0%, #E5E7EB 100%)',
                  boxShadow: 'inset 0 1px 2px rgba(200, 16, 46, 0.1)'
                }}>
                  <div 
                    className="absolute bottom-0 w-full transition-all duration-500 rounded-t-lg bg-cap-red" 
                    style={{
                      height: `${h * 0.8}%`,
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(200, 16, 46, 0.3)'
                    }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-medium text-gray-700 uppercase tracking-wider">
              <span>2023</span>
              <span>2028</span>
              <span>2033</span>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-4 sm:mb-6">Loan Mix</h3>
            <div className="space-y-3 sm:space-y-4">
              {[
                { name: 'Direct Subsidized', val: '$12,500', color: 'bg-cap-red' },
                { name: 'Direct Unsubsidized', val: '$20,000', color: 'bg-cap-navy' },
                { name: 'Private (Sallie Mae)', val: '$10,000', color: 'bg-cap-redLight' },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-cap-red/20 hover:border-cap-red/40 transition-colors"
                  style={{
                    background: 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 50%, #F3F4F6 100%)',
                    boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(200, 16, 46, 0.2), 0 2px 4px rgba(200, 16, 46, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${item.color}`} style={{
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}></div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{item.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap ml-2">{item.val}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-cap-red/20">
              <Button variant="secondary" className="w-full text-xs sm:text-sm" fullWidth>View All Loans</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
);
}
export default DashboardPage;
