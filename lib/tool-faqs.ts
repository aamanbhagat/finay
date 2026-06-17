/** FAQ schema content for each tool, surfaced both in the UI and JSON-LD. */
export const TOOL_FAQS: Record<string, { question: string; answer: string }[]> = {
  sip: [
    {
      question: "What is a SIP?",
      answer:
        "A Systematic Investment Plan (SIP) is a method of investing a fixed amount into a mutual fund at regular intervals, usually monthly. It enforces discipline and averages out your purchase price across market cycles.",
    },
    {
      question: "What return should I assume?",
      answer:
        "Indian equity mutual funds have historically delivered 10–14% CAGR over 10+ year periods, but returns are never guaranteed. A conservative assumption of 10–12% is reasonable for long-term planning.",
    },
    {
      question: "Is the SIP corpus taxable?",
      answer:
        "Yes. Long-term capital gains on equity SIPs above ₹1 lakh per year are taxed at 10% under current rules. Debt-fund SIPs are taxed at your slab rate. Verify the latest rules with a tax professional.",
    },
  ],
  emi: [
    {
      question: "How is EMI calculated?",
      answer:
        "EMI uses the formula P × r × (1+r)^n / ((1+r)^n − 1), where P is the principal, r is the monthly interest rate, and n is the number of months. Every EMI covers part interest and part principal.",
    },
    {
      question: "Does prepayment reduce my EMI or tenure?",
      answer:
        "Most lenders let you choose — reduce the tenure (more interest saved) or reduce the EMI (more monthly cashflow). Tenure reduction usually saves more money overall.",
    },
    {
      question: "Are home-loan EMIs eligible for tax benefit?",
      answer:
        "Under the old tax regime, principal repayment qualifies for 80C and interest for Section 24(b) up to ₹2 lakh per year on a self-occupied property. The new regime removes most of these benefits.",
    },
  ],
  "fd-rd": [
    {
      question: "What's the difference between FD and RD?",
      answer:
        "A Fixed Deposit takes a one-time lump sum and pays a fixed rate until maturity. A Recurring Deposit takes a fixed monthly deposit for a chosen tenure. RD interest is typically compounded quarterly in Indian banks.",
    },
    {
      question: "Is FD interest taxable?",
      answer:
        "Yes — interest is added to your income and taxed at your slab. Banks deduct TDS on interest above ₹40,000 per year (₹50,000 for senior citizens).",
    },
    {
      question: "Can I break a deposit early?",
      answer:
        "Yes, but most banks apply a small penalty (often 0.5–1% lower rate). Laddering smaller deposits across maturities reduces the need to break any single one.",
    },
  ],
  "compound-interest": [
    {
      question: "Why does compounding frequency matter?",
      answer:
        "More frequent compounding lets earlier interest earn interest sooner. Monthly compounding produces a slightly higher final value than annual compounding for the same nominal rate.",
    },
    {
      question: "Simple vs compound interest — which is in my favour?",
      answer:
        "On savings and investments, compound interest works for you. On loans, it works against you — which is why credit-card debt is so corrosive.",
    },
  ],
  "income-tax": [
    {
      question: "Which regime is better for me?",
      answer:
        "If your deductions (80C, 80D, HRA, home-loan interest) exceed roughly ₹4–6 lakh per year, the old regime usually wins. Otherwise the new regime's lower rates and ₹75,000 standard deduction tend to win.",
    },
    {
      question: "Are the slabs current?",
      answer:
        "These are illustrative FY 2025–26 slabs. Tax rules change every Budget — verify the current year's slabs and surcharge rules before filing.",
    },
    {
      question: "Does the calculator handle surcharge?",
      answer:
        "Not yet. High incomes (above ₹50 lakh) attract a surcharge on top of the base tax. The estimator is intended for typical salaried filers; consult a CA for complex situations.",
    },
  ],
  retirement: [
    {
      question: "How big a corpus do I need?",
      answer:
        "A common rule of thumb is 25–30× your annual expenses at retirement (the '4% rule'). This calculator computes the exact corpus needed for your chosen post-retirement years, inflation, and return assumptions.",
    },
    {
      question: "Is my employer PF enough?",
      answer:
        "For most people, no. PF builds a base, but matching post-retirement expenses for 25+ years typically requires additional equity-heavy investing through NPS, mutual funds, or both.",
    },
  ],
  cagr: [
    {
      question: "What is CAGR?",
      answer:
        "Compound Annual Growth Rate is the constant annual rate that would take an investment from its initial value to its final value over the period — useful for comparing investments held for different durations.",
    },
    {
      question: "Why is CAGR lower than the total return?",
      answer:
        "CAGR smooths the return over the number of years, while total return shows the full percentage gain. A 100% total return over 10 years is only ~7.2% CAGR.",
    },
  ],
  "lumpsum-vs-sip": [
    {
      question: "Which is mathematically better?",
      answer:
        "Assuming a constant positive return, a lumpsum invested earlier always grows to a larger final value because more money compounds for longer. SIPs are valuable when you can't invest a lumpsum or want to reduce timing risk.",
    },
    {
      question: "Should I lumpsum a big bonus or SIP it?",
      answer:
        "Most evidence favours investing it now, but if a lumpsum would cause sleepless nights, splitting it across 6–12 months (a 'staggered lumpsum') is a reasonable behavioural compromise.",
    },
  ],
};
