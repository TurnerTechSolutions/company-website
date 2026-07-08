import { Suspense } from 'react';
import PortalShell from '../../../views/portal/PortalShell';

export default function PortalLayout({ children }) {
  return (
    <Suspense fallback={null}>
      <PortalShell>{children}</PortalShell>
    </Suspense>
  );
}
