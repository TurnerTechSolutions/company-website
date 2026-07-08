export const metadata = {
  robots: { index: false },
};

export default function PortalGroupLayout({ children }) {
  return (
    <main id="main-content">
      {children}
    </main>
  );
}
