import type { Metadata } from 'next'
import { Bricolage_Grotesque, Montserrat } from 'next/font/google'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '600', '700', '800'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Pratham Dabas',
  description: 'Data by day. Decks by night. Deploying models in between.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${montserrat.variable} bg-night text-white antialiased`}
            style={{ fontFamily: 'var(--font-body, Montserrat, sans-serif)' }}>
        {children}
      </body>
    </html>
  )
}
