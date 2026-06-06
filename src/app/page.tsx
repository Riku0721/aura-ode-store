/**
 * ⚠️  SETUP NOTE:
 * Delete this file before running `npm run dev` or deploying.
 * The actual homepage is in src/app/(store)/page.tsx
 *
 * To delete:
 *   rm src/app/page.tsx
 *
 * This file only exists because create-next-app created it automatically.
 * Having both app/page.tsx AND app/(store)/page.tsx at / causes a route conflict.
 */
import { permanentRedirect } from 'next/navigation'

export default function RootConflictPage() {
  permanentRedirect('/__store__') // will never actually run after you delete this file
}

