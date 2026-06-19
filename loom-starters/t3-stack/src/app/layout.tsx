import '~/styles/globals.css';
import { TRPCReactProvider } from '~/trpc/react';

export const metadata = {
  title: 'T3 Stack App',
  description: 'Created with create-t3-app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
