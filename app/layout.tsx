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

const SITE_URL = 'https://pratham-dabas.vercel.app'
const TITLE = 'Pratham Dabas – Data Scientist'
const DESCRIPTION = 'Data Scientist with 4 years at S&P Global. GPA 3.83 MS from UMD. Built Otto (231 signups), shipped RAG chatbots, fine-tuned LLMs, and OTC derivatives ML. Open to DS/ML/AI roles in NYC, July 2026.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['Pratham Dabas', 'Data Scientist', 'Machine Learning', 'ML Engineer', 'AI Engineer', 'LLM', 'RAG', 'NYC'],
  authors: [{ name: 'Pratham Dabas' }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Pratham Dabas',
    images: [{ url: '/me.jpg', width: 1200, height: 630, alt: 'Pratham Dabas – Data Scientist' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/me.jpg'],
  },
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
