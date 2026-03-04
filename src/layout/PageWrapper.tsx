import Header from './Header'

interface PageWrapperProps {
  title: string
  children: React.ReactNode
}

export default function PageWrapper({ title, children }: PageWrapperProps) {
  return (
    <>
      <Header title={title} />
      <div style={{ padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </>
  )
}
