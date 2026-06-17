interface FaqProps {
  items: { question: string; answer: string }[];
}

export function Faq({ items }: FaqProps) {
  return (
    <>
      {items.map((item) => (
        <details key={item.question} className="group py-4">
          <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden
              className="grid size-6 place-items-center rounded-full border border-border text-muted transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
        </details>
      ))}
    </>
  );
}
