import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer 
      className="py-12 border-t border-gray-800"
      style={{
        background: 'linear-gradient(135deg, #003087 0%, #001F5C 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-4 tracking-tight text-white">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Optimizer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 tracking-tight text-white">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 tracking-tight text-white">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 tracking-tight text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2023 LoanOS Inc. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Estimates are for planning purposes only. Not financial advice.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
