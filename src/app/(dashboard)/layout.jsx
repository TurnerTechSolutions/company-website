export const metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return (
    <main id="main-content">
      {children}
    </main>
  );
}
