export default function FAQ(){
  const faqs = [
    { q: 'How long does delivery take?', a: '2–5 working days within Lagos; 3–7 working days nationwide.' },
    { q: 'What is your return policy?', a: '7‑day returns on unused items with tags intact. Custom orders are final.' },
    { q: 'Do you offer custom sizing?', a: 'Yes—contact us via WhatsApp to book a fitting or send measurements.' },
  ]
  return (
    <div className="container py-12">
      <h1 className="text-2xl md:text-3xl font-bold">FAQ</h1>
      <div className="mt-6 space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="p-5 rounded-xl border">
            <p className="font-semibold">{f.q}</p>
            <p className="text-gray-700 mt-1">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
