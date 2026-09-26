/*
 * Sample content, used in two places:
 *  1. Shown on the blog while no Sanity project ID is set in js/config.js.
 *  2. Imported into Sanity by `npm run seed` in /studio, so the client starts with real examples.
 * Same shape as the results of the queries in js/sanity.js.
 */
(function () {
  let k = 0;
  const key = () => 'k' + (++k).toString(36);
  const span = (text, marks = []) => ({ _type: 'span', _key: key(), text, marks });
  const block = (style, ...children) => {
    const markDefs = [];
    return {
      _type: 'block', _key: key(), style, markDefs,
      children: children.map(c => {
        if (typeof c === 'string') return span(c);
        if (c.href) {
          const def = { _type: 'link', _key: key(), href: c.href };
          markDefs.push(def);
          return span(c.text, [def._key]);
        }
        return c;
      }),
    };
  };
  const item = (listItem, ...children) => ({ ...block('normal', ...children), listItem, level: 1 });
  const p = (...c) => block('normal', ...c);
  const b = t => span(t, ['strong']);
  const i = t => span(t, ['em']);
  const code = t => span(t, ['code']);
  const link = (text, href) => ({ text, href });
  const h2 = t => block('h2', t);
  const h3 = t => block('h3', t);
  const quote = t => block('blockquote', t);
  const bullet = (...c) => item('bullet', ...c);
  const num = (...c) => item('number', ...c);
  const tip = (text, label = 'Tip') => ({ _type: 'callout', _key: key(), label, text });
  const divider = () => ({ _type: 'divider', _key: key() });

  const categories = [
    { title: 'Guides', slug: 'guides', order: 1 },
    { title: 'Seller stories', slug: 'stories', order: 2 },
    { title: 'Payments', slug: 'payments', order: 3 },
    { title: 'Delivery', slug: 'delivery', order: 4 },
    { title: 'Product updates', slug: 'updates', order: 5 },
  ];
  const cat = slug => categories.find(c => c.slug === slug);
  const author = { name: 'Kedaipal Team', role: 'Seller success', image: null };

  const posts = [
    {
      title: 'How to run your WhatsApp shop without losing a single order',
      slug: 'run-your-whatsapp-shop-without-losing-orders',
      excerpt: "Screenshots, voice notes and bank transfers scattered across chats. Here's a simple system for keeping every order, payment and delivery in one place.",
      publishedAt: '2026-09-12T09:00:00Z',
      featured: true,
      coverText: 'Never lose an order.',
      coverStyle: 'navy',
      category: cat('guides'),
      body: [
        p('If you sell on WhatsApp, you already know the feeling: a customer says ', i('"I ordered last Tuesday"'), " and you're scrolling through hundreds of messages trying to find it. Chat is a great place to sell, but a terrible place to keep records."),
        p("The good news is that you don't need a complicated system. You just need every order to follow the same simple path."),
        block('h2', '1. Capture every order the same way'),
        p('The biggest cause of lost orders is inconsistency. One customer sends a voice note, another sends a screenshot, a third just types "same as last time". Pick one format and gently guide everyone to it.'),
        item('bullet', b('Share a catalogue link'), ' so customers pick items and quantities themselves.'),
        item('bullet', b('Confirm with a summary'), ' listing items, total and delivery address.'),
        item('bullet', b('Give every order a number'), ' you can both refer to later.'),
        block('blockquote', "An order isn't really an order until both you and your customer can see the same summary."),
        block('h2', '2. Match payments to orders straight away'),
        p('Receipts arriving as screenshots are easy to lose. Record each payment against its order as soon as it comes in, rather than at the end of the day.'),
        { _type: 'callout', _key: key(), label: 'Tip', text: 'Ask customers to put the order number in the payment reference, for example KP-1042. Reconciling at month-end becomes a five-minute job.' },
        block('h2', '3. Book delivery from the same place'),
        p("Copying addresses from chat into a courier app is slow and it's where mistakes creep in. Keep the address on the order, book the courier from there, and send the tracking link back to the customer in one step."),
        block('h3', 'A simple daily routine'),
        item('number', 'Morning: check new orders and confirm anything unclear.'),
        item('number', 'Midday: match incoming payments.'),
        item('number', "Afternoon: book couriers for everything that's paid."),
        item('number', 'Evening: send tracking links and thank-you messages.'),
        { _type: 'divider', _key: key() },
        p("With a consistent flow, WhatsApp stays what it's good at: talking to your customers. The record-keeping happens in the background. ", link('See how Kedaipal puts orders, payments and couriers on one screen.', 'https://kedaipal.com')),
      ],
    },
    {
      title: 'Getting paid faster with DuitNow QR and PayNow',
      slug: 'getting-paid-faster-duitnow-qr-paynow',
      excerpt: 'Cut the back-and-forth of "dah transfer?" and confirm payments in seconds.',
      publishedAt: '2026-09-08T09:00:00Z',
      coverText: 'DuitNow QR', coverStyle: 'light', category: cat('payments'),
      body: [
        p('Every WhatsApp seller knows this message: ', i('"Dah transfer, boss."'), ' Then comes the hunt through your banking app to check whether the money actually arrived, how much it was, and which order it belongs to.'),
        p('QR payments fix most of this. In Malaysia that means ', b('DuitNow QR'), ', and in Singapore ', b('PayNow'), '. Customers scan, pay from any banking or e-wallet app, and the money lands straight in your account.'),
        h2('Why QR beats sharing your account number'),
        bullet(b('Fewer typos.'), ' Customers never key in your account number, so payments stop going to the wrong place.'),
        bullet(b('Any bank, any wallet.'), ' One code works across the major banks and e-wallets.'),
        bullet(b('It looks professional.'), ' A proper QR code builds trust with first-time buyers.'),
        h2('Setting it up in three steps'),
        num('Open your business banking app and look for the DuitNow QR or PayNow QR option.'),
        num('Download the QR image and save it somewhere easy to reach on your phone.'),
        num('Add it to your order confirmation message, right under the order total.'),
        tip('Always send the exact amount together with the QR code, for example "Total: RM48.90". Customers copy it straight into their banking app and you get fewer short payments.'),
        h2('Matching payments to orders'),
        p('The QR code gets the money to you. The harder part is knowing which order it paid for, especially on busy days.'),
        h3('Use the payment reference'),
        p('Ask customers to type the order number in the reference field, like ', code('KP-1042'), '. When you check your statement, every payment already tells you which order it belongs to.'),
        h3('Confirm once, clearly'),
        p('As soon as you see the payment, reply with a short confirmation and the next step, such as "Payment received, thank you! Shipping tomorrow." The customer stops wondering and you stop getting follow-up messages.'),
        quote('The fastest way to get paid is to make paying the easiest thing your customer does all day.'),
        divider(),
        p('QR payments take a few minutes to set up and save hours every month. Start with your next order.'),
      ],
    },
    {
      title: 'Comparing courier rates across Peninsular & East Malaysia',
      slug: 'courier-rates-peninsular-east-malaysia',
      excerpt: 'What it really costs to ship a 1kg parcel, and how to pick the right courier.',
      publishedAt: '2026-09-03T09:00:00Z',
      coverText: 'Book a courier.', coverStyle: 'navy', category: cat('delivery'),
      body: [
        p('Shipping is often the biggest surprise cost for new sellers. A parcel that costs a few ringgit to send across the Klang Valley can cost several times more to reach Sabah or Sarawak.'),
        p('Rates change often, so instead of a price list, here is how to work out what you will actually pay and how to choose a courier for each order.'),
        h2('What decides the price'),
        bullet(b('Weight'), ', rounded up to the next kilogram or half kilogram.'),
        bullet(b('Size'), '. Big but light parcels are charged by volumetric weight instead of actual weight.'),
        bullet(b('Destination zone'), '. Within the same state, across Peninsular Malaysia, or to East Malaysia.'),
        bullet(b('Speed and service'), ', such as next-day delivery, pick-up versus drop-off, and cash on delivery.'),
        h3('Working out volumetric weight'),
        p('Most couriers use this formula: length × width × height in centimetres, divided by 5,000. A 30 × 20 × 15 cm box works out to 1.8 kg, even if what is inside weighs 600 g.'),
        tip('Pack in the smallest box that protects the item. Trimming a few centimetres can drop a parcel into a cheaper weight band.', 'Save money'),
        h2('Peninsular vs East Malaysia'),
        p('Parcels to Sabah, Sarawak and Labuan travel by air or sea, so they cost more and take longer. Tell customers this up front. Surprise shipping fees at checkout are one of the most common reasons buyers go quiet.'),
        num('Set separate shipping fees for Peninsular and East Malaysia.'),
        num('Show the delivery estimate for each region in your catalogue.'),
        num('Offer free shipping above a minimum spend to encourage bigger orders.'),
        h2('Choosing a courier'),
        p('No single courier is best everywhere. Compare them on the routes you ship most, and keep at least two options so one delay does not hold up all your orders.'),
        quote('The cheapest courier is the one that gets there on time. A late parcel costs you the next order.'),
        divider(),
        p('Check your own numbers once a month, looking at average parcel weight, your top destinations and delivery times, and adjust your shipping fees to match.'),
      ],
    },
    {
      title: 'Writing product listings that actually sell on chat',
      slug: 'product-listings-that-sell-on-chat',
      excerpt: 'Photos, prices and wording that turn "PM for price" browsers into buyers.',
      publishedAt: '2026-08-27T09:00:00Z',
      coverText: 'Catalogue', coverStyle: 'light', category: cat('guides'),
      body: [
        p('On WhatsApp, your product listing is the whole shop window. A customer decides in a few seconds whether to ask a question or scroll past.'),
        p('Good listings answer the obvious questions before anyone has to ask, and that is what turns browsers into buyers.'),
        h2('1. Photos do most of the selling'),
        bullet(b('Use natural light.'), ' A spot next to a window beats any filter.'),
        bullet(b('Keep the background plain'), ' so the product stands out.'),
        bullet(b('Show scale.'), ' Put the item in a hand, on a table or next to something familiar.'),
        bullet(b('Add at least three angles'), ': front, detail and in use.'),
        h2('2. Always show the price'),
        p(i('"PM for price"'), ' feels like extra work to most buyers, and many simply move on. Showing the price filters in serious buyers and saves you answering the same question all day.'),
        tip('If prices vary by size or flavour, list them all, for example "Small RM25 · Medium RM38 · Large RM52".'),
        h2('3. Write for a quick read'),
        p('Keep descriptions short and scannable. Lead with what the product is and why it is good, then the details.'),
        h3('A simple template'),
        num(b('Name'), ', clear and specific, like "Kuih Lapis, 12 pieces".'),
        num(b('One-line benefit'), ', such as "Made fresh every morning, no preservatives".'),
        num(b('Details'), ': size, weight, ingredients or materials.'),
        num(b('Delivery and ordering info'), ', like "Orders before 2pm ship the same day".'),
        quote('Every question a customer has to ask is a moment they might decide not to buy.'),
        divider(),
        p('Update your best-selling listings first. Small changes to photos and wording often make the biggest difference.'),
      ],
    },
    {
      title: 'New: automatic payment reminders for unpaid orders',
      slug: 'automatic-payment-reminders',
      excerpt: 'Friendly nudges go out on their own, so you never have to chase awkwardly.',
      publishedAt: '2026-08-20T09:00:00Z',
      coverText: "What's new.", coverStyle: 'navy', category: cat('updates'),
      body: [
        p('Chasing unpaid orders is one of the least favourite parts of selling online. It takes time, it feels awkward, and it is easy to forget who still owes what.'),
        p('Automatic payment reminders take care of it for you, politely and on time.'),
        h2('How it works'),
        num('A customer places an order and receives the payment details.'),
        num('If the order is still unpaid after the time you choose, a friendly reminder is sent automatically.'),
        num('Once payment comes in, reminders stop and the order moves to ready to ship.'),
        h2('You stay in control'),
        bullet(b('Choose the timing'), ', for example after 6 hours, 24 hours or 3 days.'),
        bullet(b('Edit the message'), ' so it sounds like you.'),
        bullet(b('Turn it off'), ' for regular customers or special orders.'),
        tip('Keep reminders short and warm, such as "Hi Aina! Just a reminder that order KP-1042 is waiting for payment. Let us know if you need anything 😊"', 'Example'),
        h2('Why it helps'),
        p('Most unpaid orders are not customers changing their minds. They got busy and forgot. A timely nudge brings many of them back without you lifting a finger.'),
        quote('Nobody likes chasing payments. Now you do not have to.'),
        divider(),
        p('Payment reminders are available on all plans. Turn them on in your settings under Orders.'),
      ],
    },
    {
      title: 'Preparing your shop for the festive season rush',
      slug: 'festive-season-rush',
      excerpt: 'Stock, cut-off dates and customer messages to plan before orders spike.',
      publishedAt: '2026-08-14T09:00:00Z',
      coverText: 'Raya rush.', coverStyle: 'green', category: cat('guides'),
      body: [
        p('Hari Raya, Chinese New Year, Deepavali, Christmas and the big sale days like 11.11 can bring in more orders in a week than you usually see in a month. A little planning keeps the rush profitable instead of stressful.'),
        h2('Six weeks before: plan your stock'),
        bullet('Look back at last year to see what sold out first and what was left over.'),
        bullet('Order packaging early, because boxes and bubble wrap run short too.'),
        bullet('Create festive bundles or gift sets. They are easy to buy and raise your average order.'),
        h2('Four weeks before: set your cut-off dates'),
        p('Couriers slow down before every major holiday. Work backwards from the festival date and announce a clear last day to order.'),
        tip('Set your cut-off a few days earlier for East Malaysia, where parcels need extra time to arrive.', 'Important'),
        h3('Tell customers early and often'),
        num('Pin the cut-off dates in your WhatsApp status and catalogue.'),
        num('Mention them in every order confirmation.'),
        num('Send a final reminder three days before the cut-off.'),
        h2('During the rush'),
        p('Keep things simple. Batch similar tasks together, like packing all morning and booking couriers in the afternoon, and reply to customers in set blocks of time rather than all day.'),
        quote('A calm festive season is planned in advance, not handled on the day.'),
        divider(),
        p('After the season, write down what worked and what did not. Next year you will be starting from a much better plan.'),
      ],
    },
  ].map(post => ({ ...post, author, mainImage: null }));

  const data = { categories, author, posts };
  if (typeof window !== 'undefined') window.KEDAIPAL_DEMO = data;
  if (typeof globalThis !== 'undefined') globalThis.KEDAIPAL_DEMO = data;
})();
