import './globals.css';

export const metadata = {
  title: 'Student Loan App',
  description: 'Student Loans App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

