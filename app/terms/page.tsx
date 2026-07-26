import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-20 text-zinc-300">
        <h1 className="text-4xl font-black text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="mb-2 text-lg font-bold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or using QMZWERKZ.ZIP ("we," "us," "our," or "the Site"), you agree
              to be bound by these Terms of Service. If you do not agree, do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">2. Digital Products</h2>
            <p>
              All products sold on QMZWERKZ.ZIP are digital goods delivered electronically -
              custom FiveM assets, scripts, graphics, websites, and related digital work. No
              physical items are shipped. Access to purchased files is unlocked immediately
              after payment is confirmed and is available through your account.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">3. License & Usage</h2>
            <p>
              Purchasing a product grants you a personal, non-transferable license to use that
              asset. Unless explicitly stated otherwise on the product page, you may not resell,
              redistribute, share, or re-upload purchased files to other marketplaces, servers,
              or individuals. Reselling or leaking purchased content may result in account
              termination and loss of access to future purchases.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">4. Account & Sign-In</h2>
            <p>
              An account is created and authenticated via Discord OAuth when you sign in.
              You're responsible for keeping your Discord account secure - anyone with access
              to it can access your QMZWERKZ purchases and downloads.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">5. Payments</h2>
            <p>
              Payments are processed by third-party payment providers (Tebex and/or PayPal).
              We do not collect or store your card details. All prices are listed in USD unless
              stated otherwise.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">6. Refunds</h2>
            <p>
              Due to the instant, digital nature of our products, all sales are generally final
              once a file has been downloaded. If you experience an issue with a purchase -
              wrong file, corrupted download, or a product not working as described - open a
              support ticket on our Discord server and we'll work with you to resolve it.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">7. Lucky Wheel</h2>
            <p>
              The Lucky Wheel is a free promotional feature available once every 24 hours to
              signed-in users. Prizes must be redeemed via a Discord support ticket using the
              claim code provided. We reserve the right to modify, suspend, or end the Lucky
              Wheel program at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">8. Prohibited Use</h2>
            <p>
              You may not use the Site for any unlawful purpose, attempt to bypass purchase
              verification to access files you haven't paid for, or attempt to disrupt or
              compromise the Site's security or infrastructure.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">9. Disclaimer & Liability</h2>
            <p>
              Products are provided "as is." We make reasonable efforts to ensure compatibility
              and quality but do not guarantee that every asset will work with every server
              configuration. To the fullest extent permitted by law, QMZWERKZ.ZIP is not liable
              for indirect, incidental, or consequential damages arising from use of our products.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">10. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Site after
              changes are posted constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">11. Contact</h2>
            <p>
              Questions about these Terms? Reach out via our Discord support server.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
