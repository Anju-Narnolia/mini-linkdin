import './globals.css';
import { ReactNode } from 'react';
import NavBar from '../components/NavBar';
import Providers from '../components/Providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
