import { ApplicationShell } from '@/components/layout/application-shell';

/**
 * Root Application Canvas:
 * Connects the structural Top, Main, and Bottom layout regions.
 */
export default function HomePage() {
  return (
    <ApplicationShell>
      {/* Top Region: Reserved for Nav Button & Branding */}
      <ApplicationShell.Top />

      {/* Main Region: Flexible canvas for Conversation & Content */}
      <ApplicationShell.Main className="items-center justify-center text-center p-4">
        <div className="max-w-sm space-y-2 opacity-80">
          <p className="typography-metadata text-kleava-text-secondary">
            KLEAVA AI — CANVAS SHELL READY
          </p>
        </div>
      </ApplicationShell.Main>

      {/* Bottom Region: Reserved for Chat Composer */}
      <ApplicationShell.Bottom />
    </ApplicationShell>
  );
}