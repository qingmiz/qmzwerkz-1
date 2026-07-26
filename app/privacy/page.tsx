import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-20 text-zinc-300">
        <h1 className="text-4xl font-black text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed">
          <section>
            <p>
              This Privacy Policy explains what information QMZWERKZ.ZIP collects, why, and how
              it's used. We only collect what's needed to run the store and support you.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">1. Information We Collect</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li><span className="text-white">Discord account info</span> - username, avatar, and email, provided when you sign in with Discord.</li>
              <li><span className="text-white">Order information</span> - which products you purchased, order status, and payment method used (we do not see or store your card or PayPal details - those are handled entirely by Tebex/PayPal).</li>
              <li><span className="text-white">Cfx.re/FiveM username</span> - only if you choose to provide it at checkout.</li>
              <li><span className="text-white">Lucky Wheel activity</span> - your spin history, prizes won, and claim codes, tied to your Discord ID.</li>
              <li><span className="text-white">Cart contents</span> - stored locally in your browser (localStorage), not on our servers, until you check out.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">2. How We Use Your Information</h2>
            <p>
              We use this information to process purchases, deliver digital downloads, verify
              purchase ownership before releasing files, send order confirmation emails, run the
              Lucky Wheel, and provide customer support.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">3. Third-Party Services</h2>
            <p>We rely on the following third parties to operate the Site. Each has its own privacy policy governing data they process on our behalf:</p>
            <ul className="list-disc space-y-1 pl-5 mt-2">
              <li><span className="text-white">Supabase</span> - database and authentication hosting.</li>
              <li><span className="text-white">Discord</span> - sign-in and identity verification.</li>
              <li><span className="text-white">Tebex &amp; PayPal</span> - payment processing.</li>
              <li><span className="text-white">Resend</span> - transactional email delivery (order confirmations, prize notifications).</li>
              <li><span className="text-white">Vercel</span> - website hosting.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">4. Data Retention</h2>
            <p>
              We retain order and account data for as long as your account is active, or as
              needed to comply with legal obligations, resolve disputes, and enforce our
              agreements.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">5. Your Rights</h2>
            <p>
              You can request a copy of the data we hold about you, or request deletion of your
              account and associated data, by opening a support ticket on Discord. Note that we
              may need to retain certain order records for legal/accounting purposes even after
              an account deletion request.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">6. Cookies & Local Storage</h2>
            <p>
              We use your browser's local storage to remember your cart contents between pages.
              We don't use third-party advertising trackers.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">7. Children's Privacy</h2>
            <p>
              QMZWERKZ.ZIP is not directed at children under 13. We do not knowingly collect
              information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be
              reflected by updating the "Last updated" date above.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">9. Contact</h2>
            <p>
              Questions about this policy or your data? Reach out via our Discord support server.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
