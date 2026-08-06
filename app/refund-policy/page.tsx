import Footer from '@/components/layout/Footer';

export default function RefundPolicyPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-20 text-zinc-300">
        <h1 className="text-4xl font-black text-white">Refund Policy</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="mt-8 rounded-2xl border border-pink-500/30 bg-pink-500/5 p-6">
          <p className="text-lg font-bold text-white">All sales are final. We do not offer refunds.</p>
          <p className="mt-2 text-sm text-zinc-400">
            Once a payment is completed, that purchase cannot be refunded, cancelled, or reversed - for any reason,
            including change of mind, buyer's remorse, or simply no longer wanting the item.
          </p>
        </div>

        <div className="mt-10 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="mb-2 text-lg font-bold text-white">Why we don't offer refunds</h2>
            <p>
              Everything sold on QMZWERKZ.ZIP is a digital product - custom FiveM assets, scripts,
              graphics, and similar files - delivered instantly and electronically. Unlike a
              physical item, a digital file can't be "returned": once it's downloaded, it's been
              fully delivered and can be used, copied, or installed immediately. Because of this,
              we treat every completed purchase as final.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">What we WILL help with</h2>
            <p>No refunds, but we do stand behind getting you what you actually paid for. If any of these happen, open a Discord support ticket and we'll fix it directly (not as a refund, but as a correction):</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>You were charged but never received access to your download</li>
              <li>The file you received is corrupted, incomplete, or the wrong file entirely</li>
              <li>You were accidentally charged twice for the same order</li>
            </ul>
            <p className="mt-3 text-zinc-400">
              These are delivery/technical issues, not refund requests - we'll re-deliver, fix, or
              correct the charge as appropriate.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">What we will NOT refund</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Change of mind after purchase</li>
              <li>The product not fitting your specific server setup or preferences, where the product otherwise works as described</li>
              <li>Buying the wrong product by mistake</li>
              <li>Any purchase where the file has already been downloaded</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">Chargebacks &amp; payment disputes</h2>
            <p>
              Please contact us on Discord before filing a chargeback or payment dispute with your
              bank, PayPal, or card provider. Filing a dispute without reaching out first - for an
              order where the product was successfully delivered - may result in your account being
              suspended from future purchases and access to previously purchased files being
              revoked.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">Lucky Wheel prizes &amp; promo codes</h2>
            <p>
              Prizes, discount codes, and shop credit won through the Lucky Wheel are promotional
              and have no cash value - they can't be refunded, exchanged for cash, or transferred
              to another account.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-white">Questions</h2>
            <p>
              If something about your order doesn't seem right, open a support ticket on our
              Discord server and we'll take a look.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
