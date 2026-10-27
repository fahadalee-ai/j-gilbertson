export type ServiceCategory = "Tax" | "Accounting" | "Business" | "Advisory";

export type Service = {
  id: string;
  name: string;
  category: ServiceCategory;
  summary: string;
  tagline: string;
  minutes: number;
  freeIntro: boolean;
  popular?: boolean;
  /** Hidden from the services catalog, still bookable from Home. */
  catalog: boolean;
  image: string;
  overview: string[];
  included: string[];
  audience: string[];
  steps: { title: string; body: string }[];
  documents: { title: string; detail: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const categories: Array<"All" | ServiceCategory> = ["All", "Tax", "Accounting", "Business", "Advisory"];

export const services: Service[] = [
  {
    id: "intro-call",
    name: "Free 15-Minute Intro Call",
    category: "Advisory",
    summary: "A short call to point you to the right service.",
    tagline: "Tell us what you need. We will point you to the right next step.",
    minutes: 15,
    freeIntro: true,
    catalog: false,
    image: "office-hero.jpg",
    overview: [
      "This intro call is a fit check, not a full consultation. In about 15 minutes we learn whether you need tax preparation, bookkeeping, help with a notice, or something else.",
      "There is no fee for this call and no obligation to continue. If we are the right firm, we will suggest a service and a longer appointment. If we are not, we will say so.",
    ],
    included: [
      "A short conversation about your situation",
      "A recommendation for the service that fits",
      "A clear next step, including what to bring",
      "Time to ask how the firm works",
    ],
    audience: ["First-time visitors", "New business owners", "Anyone unsure where to start"],
    steps: [
      { title: "Book", body: "Pick a phone or video time. In-office is available if you prefer to stop by." },
      { title: "Share a sentence", body: "Tell us, in a few words, what prompted the call." },
      { title: "Talk", body: "We listen, ask a few questions, and name the service that fits." },
      { title: "Decide", body: "You choose whether to book the longer appointment. There is no pressure." },
    ],
    documents: [
      { title: "Nothing is required", detail: "Do not scramble for paperwork. A prior-year return is helpful only if you already have it handy." },
    ],
    faqs: [
      { q: "Is this really free?", a: "Yes. The 15-minute intro call has no fee. A later engagement is priced only after we understand the work." },
      { q: "Will you prepare my return on this call?", a: "No. Fifteen minutes is enough to point you in the right direction, not enough to prepare a filing." },
      { q: "Who will I speak with?", a: "You will speak with KJ Gilbertson, CPA, or a member of the client team." },
    ],
    related: ["consultation", "individual-tax", "business-tax"],
  },
  {
    id: "individual-tax",
    name: "Individual Tax Preparation",
    category: "Tax",
    summary: "Personal federal and Nevada-related filings, explained clearly.",
    tagline: "A careful personal return, with time to walk through it before anything is filed.",
    minutes: 60,
    freeIntro: true,
    popular: true,
    catalog: true,
    image: "svc-individual.jpg",
    overview: [
      "We prepare individual federal returns for people with wages, self-employment, investments, a home sale, or a mix of those. If a Nevada filing or a city business license question comes up, we will tell you what applies and what does not.",
      "You review the return with us before it is filed. We explain the lines that changed from last year and the items that still need a document. We do not promise a refund amount.",
      "If your return is tied to a small business, we can prepare both and keep the stories consistent. If you only need the personal return, that is fine too.",
    ],
    included: [
      "Federal Form 1040 preparation",
      "Review of W-2, 1099, and self-employment income",
      "A walkthrough before filing",
      "E-file support once you approve the return",
      "A copy of the filed return for your records",
    ],
    audience: ["Wage earners", "Freelancers with a Schedule C", "People who sold a home", "Married couples with combined income"],
    steps: [
      { title: "Book", body: "Reserve 60 minutes. A free 15-minute intro is available if you are not sure this is the right service." },
      { title: "Share documents", body: "Upload last year's return and this year's income forms. A photo is fine." },
      { title: "Review with your CPA", body: "We go through the draft and the questions we still have." },
      { title: "Filing", body: "After you approve, we e-file and send you the acceptance confirmation." },
    ],
    documents: [
      { title: "Last year's return", detail: "A PDF of Form 1040, if you filed last year, helps us catch carryovers." },
      { title: "Income forms", detail: "W-2s, 1099s, K-1s, and unemployment or retirement forms." },
      { title: "Deduction records", detail: "Mortgage interest, property tax, charitable gifts, and childcare statements if you plan to itemize or claim a credit." },
      { title: "Identity items", detail: "Social Security numbers and a photo ID for everyone on the return. Have bank details ready only if you want a direct deposit." },
    ],
    faqs: [
      { q: "Do I need to itemize?", a: "Not always. We compare the standard deduction with the records you have and use the one the numbers support. We will show you the comparison." },
      { q: "Can you file an extension?", a: "Yes. An extension gives more time to file, not more time to pay. We will talk through any payment that may still be due." },
      { q: "What if I lived in two states?", a: "Tell us the dates. We will prepare the resident and nonresident returns that apply. Nevada has no wage income tax, but another state might." },
      { q: "When should I book?", a: "Earlier is calmer. January is a good time if your forms arrive early. March is still workable. April is reserved for people who are ready to file." },
    ],
    related: ["tax-planning", "consultation", "business-tax"],
  },
  {
    id: "business-tax",
    name: "Business Tax Preparation",
    category: "Tax",
    summary: "Returns for LLCs, S-Corps, partnerships, and sole proprietors.",
    tagline: "Entity returns prepared from your books, with owner filings kept in sync.",
    minutes: 60,
    freeIntro: true,
    popular: true,
    catalog: true,
    image: "svc-business-tax.jpg",
    overview: [
      "We prepare returns for sole proprietors, partnerships, multi-member LLCs, and S corporations. The starting point is your bookkeeping. If the books are behind, we will say so and can pair this work with a cleanup.",
      "Owner draws, reasonable compensation, and Nevada commerce tax questions are part of the conversation when they apply. We explain what the return is reporting. We do not guarantee a lower tax bill.",
      "You approve the return before it is filed. If a personal return depends on a K-1, we time the two so you are not waiting in the dark.",
    ],
    included: [
      "Preparation of the business return for your entity type",
      "A review of income, expenses, and owner activity",
      "K-1 drafts for owners when the entity issues them",
      "A filing checklist and e-file once you approve",
      "Notes on items to track differently next year",
    ],
    audience: ["LLC owners", "S corporation owners", "Partnerships", "Sole proprietors", "Cafe, retail, and contractor businesses"],
    steps: [
      { title: "Book", body: "Choose a 60-minute visit and tell us the entity type." },
      { title: "Share the books", body: "Send a profit and loss, balance sheet, and last year's return." },
      { title: "Review with your CPA", body: "We walk through unusual items, owner pay, and anything that does not tie out." },
      { title: "Filing", body: "After approval, we file the business return and confirm what each owner still needs." },
    ],
    documents: [
      { title: "Prior business return", detail: "Last year's Form 1065, 1120-S, or Schedule C, plus any K-1s you received." },
      { title: "Year-end reports", detail: "Profit and loss and balance sheet for the tax year, even if they are still in draft." },
      { title: "Owner activity", detail: "A list of contributions, distributions, and any personal expenses paid by the business." },
      { title: "Payroll reports", detail: "W-3, W-2s, and 1099-NECs if you paid people. We need these before an S corporation return can be finished." },
    ],
    faqs: [
      { q: "My books are a mess. Can you still file?", a: "Often yes, after a cleanup. We will tell you if the records are strong enough to file or if bookkeeping should come first." },
      { q: "Should I be an S corporation?", a: "That is a planning question, not something we decide on filing day. We can book a tax planning visit if you want to compare structures for next year." },
      { q: "Do you handle Nevada commerce tax?", a: "We will look at whether your gross revenue is in the range that requires a commerce tax filing and help you prepare it when it does. Not every business owes it." },
      { q: "Can you work from QuickBooks?", a: "Yes. An accountant copy or a read-only invite is ideal. Spreadsheets work if they are complete." },
    ],
    related: ["bookkeeping", "tax-planning", "payroll"],
  },
  {
    id: "tax-planning",
    name: "Tax Planning and Strategy",
    category: "Tax",
    summary: "A forward look at estimates, entity choices, and timing.",
    tagline: "Decisions made before year-end, while you can still act on them.",
    minutes: 45,
    freeIntro: true,
    catalog: true,
    image: "svc-planning.jpg",
    overview: [
      "Tax planning is a working session about the year you are in, not a look backward. We review income so far, expected profit, owner pay, and any big purchases or hires you are considering.",
      "You leave with options and the tradeoffs we see. A retirement contribution, a timing change, or an entity conversation might be on the list. None of those are automatic, and none come with a promised savings figure.",
      "This visit is useful in the fall, and it is also useful any time the business changes shape.",
    ],
    included: [
      "A review of year-to-date profit",
      "Estimated payment check-in",
      "Ideas to consider before year-end",
      "A written list of next steps",
    ],
    audience: ["Owners planning a strong year", "Freelancers with uneven income", "Anyone considering a new entity", "People who were surprised by last year's bill"],
    steps: [
      { title: "Book", body: "A 45-minute visit is usually enough. Tell us what decision you are facing." },
      { title: "Share a snapshot", body: "A current profit and loss and last year's return give us a baseline." },
      { title: "Review with your CPA", body: "We look at estimates, timing, and the choices that are actually open." },
      { title: "Delivery", body: "You get a short list of actions, with dates, that you can accept or set aside." },
    ],
    documents: [
      { title: "Last year's return", detail: "Personal and business, if both exist." },
      { title: "Year-to-date books", detail: "A profit and loss through last month is enough." },
      { title: "Estimates already paid", detail: "Dates and amounts of federal and state estimates, if you pay them." },
    ],
    faqs: [
      { q: "Is this the same as tax preparation?", a: "No. Preparation reports the year that ended. Planning looks at the year that is still open." },
      { q: "Will you tell me exactly what I will owe?", a: "We can build an estimate from the numbers you share. It changes if income changes. It is not a bill and not a guarantee." },
      { q: "How often should we do this?", a: "Once in the fall is a solid rhythm. Faster-growing businesses sometimes check in quarterly." },
    ],
    related: ["individual-tax", "business-tax", "advisory"],
  },
  {
    id: "irs-representation",
    name: "IRS and State Tax Representation",
    category: "Tax",
    summary: "Help reading notices, audits, and resolution options.",
    tagline: "A calm review of the letter, and a plan for how to respond.",
    minutes: 60,
    freeIntro: false,
    catalog: true,
    image: "svc-irs.jpg",
    overview: [
      "A notice is stressful and often less final than it looks. We read the letter with you, identify the tax year and the issue, and explain the response window in plain language.",
      "Representation can include help replying to an IRS or Nevada notice, gathering the records an auditor asked for, or discussing resolution options such as a payment plan. What is available depends on the balance, the year, and your current finances.",
      "We will not promise that a penalty will be removed or that a balance will be reduced. We will tell you the options we see and the ones we do not.",
    ],
    included: [
      "A line-by-line reading of the notice",
      "A list of records that address the issue",
      "A response plan and timeline",
      "Communication with the agency when you authorize it",
    ],
    audience: ["People who received an IRS letter", "Businesses with a payroll notice", "Clients in an audit", "Anyone with an older balance"],
    steps: [
      { title: "Book", body: "Reserve 60 minutes and upload a photo of every page of the notice." },
      { title: "Share documents", body: "The letter, the return for that year, and any records the letter mentions." },
      { title: "Review with your CPA", body: "We explain what is being asked and which response fits." },
      { title: "Response", body: "With your approval, we reply or contact the agency and keep you posted." },
    ],
    documents: [
      { title: "The notice", detail: "Every page, including the envelope page that shows the date. A clear photo works." },
      { title: "The return for that year", detail: "The filed Form 1040 or business return the letter refers to." },
      { title: "Supporting records", detail: "Only the items the letter questions. We will tell you if we need more." },
    ],
    faqs: [
      { q: "Should I call the number on the letter first?", a: "You can, but you do not have to. Bring it to us before you agree to anything on a phone call. Note the response date so we do not miss it." },
      { q: "Can you stop a levy or a wage garnishment?", a: "Sometimes a timely response or a payment arrangement changes what the agency does next. It depends on the case. We will not promise a stop." },
      { q: "What if I cannot pay the balance?", a: "We look at payment plans and other resolution paths the IRS publishes. Qualifying depends on your finances, and we will be honest if a path is a poor fit." },
      { q: "Do you handle state letters too?", a: "Yes. Nevada and other state notices are welcome. Bring the letter even if you are not sure which agency sent it." },
    ],
    related: ["individual-tax", "business-tax", "consultation"],
  },
  {
    id: "sales-payroll-tax",
    name: "Sales and Payroll Tax Filings",
    category: "Tax",
    summary: "Sales tax, modified business tax, and payroll tax filings.",
    tagline: "Recurring filings kept on a calendar, so a busy month does not skip one.",
    minutes: 45,
    freeIntro: false,
    catalog: true,
    image: "svc-sales-tax.jpg",
    overview: [
      "Nevada businesses often juggle sales tax, the modified business tax, and federal payroll deposits. We set up the calendar for the filings that apply to you and prepare them from your sales and payroll reports.",
      "If a filing does not apply, we will tell you. Not every business collects sales tax, and not every employer has the same deposit schedule.",
      "This is recurring work. The first meeting maps what you file. Later filings can be handled on a schedule we agree on.",
    ],
    included: [
      "A list of the filings that apply to your business",
      "Preparation of sales and payroll tax returns you assign to us",
      "A calendar of due dates",
      "A review when a filing looks out of pattern",
    ],
    audience: ["Retailers", "Restaurants and cafes", "Employers", "Businesses selling taxable goods"],
    steps: [
      { title: "Book", body: "Tell us which filings you are already doing, even if some are late." },
      { title: "Share reports", body: "Sales by period and payroll reports are the core records." },
      { title: "Review with your CPA", body: "We confirm what is taxable and which accounts are active." },
      { title: "Filing", body: "We prepare the returns on the schedule we set and send you a copy." },
    ],
    documents: [
      { title: "Sales reports", detail: "Point-of-sale totals by month, including nontaxable sales if you track them." },
      { title: "Payroll reports", detail: "Gross wages, tips if you have them, and tax deposits already made." },
      { title: "Account letters", detail: "Nevada sales tax or modified business tax account numbers, if you have them." },
    ],
    faqs: [
      { q: "I am behind. Can we catch up?", a: "Usually yes. Bring what you have. We will list the missing periods and file in order. Penalties can apply to late periods, and we cannot promise they will be waived." },
      { q: "Do I need a sales tax permit?", a: "If you sell taxable goods or certain services in Nevada, you may. We will look at what you sell before you register for an account you do not need." },
      { q: "Is this the same as payroll processing?", a: "No. Payroll services pay your people. This service files the tax reports. Many clients use both." },
    ],
    related: ["payroll", "bookkeeping", "business-tax"],
  },
  {
    id: "bookkeeping",
    name: "Bookkeeping and Monthly Accounting",
    category: "Accounting",
    summary: "Monthly books you can read, closed on a steady rhythm.",
    tagline: "A month-end close, a short explanation, and books you can trust at tax time.",
    minutes: 45,
    freeIntro: true,
    popular: true,
    catalog: true,
    image: "svc-bookkeeping.jpg",
    overview: [
      "Monthly bookkeeping keeps income, expenses, and what you owe or own in one place. We reconcile the bank and card accounts, categorize transactions, and send you a simple snapshot.",
      "The goal is a set of books a lender, a partner, or your future self can follow. We use plain category names and we ask when a transaction is unclear instead of guessing.",
      "Catch-up projects are welcome. We will estimate the months involved before we start, and the fee is discussed once we see the volume.",
    ],
    included: [
      "Bank and credit card reconciliation",
      "Transaction categorization",
      "A monthly profit snapshot",
      "Questions flagged instead of guessed",
      "A file that is ready for tax season",
    ],
    audience: ["Owners who are months behind", "Freelancers using a single bank account", "Shops and cafes", "Anyone tired of a shoebox"],
    steps: [
      { title: "Book", body: "Tell us how many accounts you have and how far behind the books are." },
      { title: "Share access", body: "A read-only bank connection or statements, plus last year's return if you have it." },
      { title: "Review with your CPA", body: "We close the first month together so the categories match how you talk about the business." },
      { title: "Delivery", body: "Each month you get a short snapshot and a list of anything we still need." },
    ],
    documents: [
      { title: "Bank and card statements", detail: "Every business account, for the months you want closed." },
      { title: "Loan and sales tax accounts", detail: "Statements help us record balances, not just spending." },
      { title: "Prior books", detail: "A QuickBooks file, spreadsheet, or nothing at all. We can start clean if we have to." },
    ],
    faqs: [
      { q: "How current will the books be?", a: "We typically close a month shortly after it ends, once statements are available. We will agree the day with you." },
      { q: "Can you work in my existing file?", a: "Yes, if the file is usable. If it is not, a cleanup may be the better first step. We will say which one we recommend." },
      { q: "Do you pay my bills?", a: "Not in the standard monthly service. We record what you paid. Bill pay can be discussed separately." },
      { q: "What does monthly service cost?", a: "The fee is discussed after we see the number of accounts and transactions. We do not publish a flat price that ignores the work." },
    ],
    related: ["quickbooks", "financial-statements", "payroll"],
  },
  {
    id: "payroll",
    name: "Payroll Services",
    category: "Accounting",
    summary: "Paydays, pay stubs, and the tax deposits behind them.",
    tagline: "Pay your team on time, with the tax side handled in the same rhythm.",
    minutes: 45,
    freeIntro: false,
    catalog: true,
    image: "svc-payroll.jpg",
    overview: [
      "Payroll is the promise you make to your team every pay period. We set up employees or contractors correctly, run the payroll you approve, and keep the related tax deposits on the schedule that applies to you.",
      "Tips, overtime, and Nevada minimum wage questions come up often for cafes and crews. Bring the facts and we will apply the rule we see. We will not guess at hours.",
      "You still approve each payroll before it is released. We do not move money without that yes.",
    ],
    included: [
      "Employee or contractor setup guidance",
      "Payroll runs that you approve",
      "Pay stubs and a payroll register",
      "Federal and Nevada payroll tax deposits and filings we agree to handle",
    ],
    audience: ["First-time employers", "Cafes and restaurants", "Contractors with a crew", "Owners paying themselves through an S corporation"],
    steps: [
      { title: "Book", body: "Tell us how many people you pay and how often." },
      { title: "Share documents", body: "We need hiring forms, pay rates, and direct deposit details before the first run." },
      { title: "Review with your CPA", body: "We run a sample payroll and check withholdings with you." },
      { title: "Delivery", body: "On your schedule, you approve hours and we release pay and the related reports." },
    ],
    documents: [
      { title: "Hiring forms", detail: "Form W-4, I-9, and a Nevada new-hire record for each employee." },
      { title: "Pay rates", detail: "Hourly rates, salaries, and any tip or commission arrangement." },
      { title: "Prior payroll reports", detail: "If you are switching providers, the last quarter's reports keep the year-to-date numbers honest." },
    ],
    faqs: [
      { q: "Employee or contractor?", a: "The label on an invoice does not decide it. We look at how the person works. Misclassification can create tax and labor issues, so we would rather pause than guess." },
      { q: "Can you take this over mid-year?", a: "Yes. We need year-to-date wages and taxes already withheld so the W-2s at year-end are right." },
      { q: "Do you file the quarterly payroll reports?", a: "Yes, when payroll service includes them. We will list exactly which forms are in the engagement before you start." },
    ],
    related: ["sales-payroll-tax", "bookkeeping", "business-tax"],
  },
  {
    id: "financial-statements",
    name: "Financial Statements and Reporting",
    category: "Accounting",
    summary: "Profit and loss, balance sheet, and a report you can hand to a lender.",
    tagline: "Statements that tie to the books, with a short explanation of what changed.",
    minutes: 45,
    freeIntro: false,
    catalog: true,
    image: "svc-statements.jpg",
    overview: [
      "Some decisions need more than a bank balance. We prepare a profit and loss and a balance sheet from reconciled books, and we add a short cover note about what moved.",
      "Lenders, landlords, and partners often ask for this package. If your books are not ready, we start with bookkeeping so the statements are worth handing to someone.",
      "These are management statements prepared from your records. They are not an audit, and they are not a promise about future profit.",
    ],
    included: [
      "Profit and loss for the period you choose",
      "Balance sheet",
      "A short written explanation of major changes",
      "A format suitable to share with a lender or partner",
    ],
    audience: ["Owners applying for a loan", "Partners who want a shared picture", "Businesses preparing to sell or expand"],
    steps: [
      { title: "Book", body: "Tell us the period and who will read the report." },
      { title: "Share the books", body: "Reconciled books are the input. If they are not reconciled, we will say so." },
      { title: "Review with your CPA", body: "We walk through the statements and the lines a lender is likely to ask about." },
      { title: "Delivery", body: "You receive a PDF package and a chance to ask follow-up questions." },
    ],
    documents: [
      { title: "Reconciled books", detail: "A QuickBooks file or a spreadsheet that matches the bank." },
      { title: "Loan statements", detail: "Balances and terms, so the balance sheet is complete." },
      { title: "The request you received", detail: "If a lender listed a format, send that page so we match it." },
    ],
    faqs: [
      { q: "Is this an audit?", a: "No. We prepare statements from the records you provide. An audit is a different engagement with different testing, and this firm is not offering an audit through this booking." },
      { q: "Can you include a forecast?", a: "A simple forward view belongs in an advisory session. The statements themselves describe a period that already happened." },
      { q: "How fast can you turn this around?", a: "It depends on how clean the books are. We will give you a realistic date after we see them, not a slogan." },
    ],
    related: ["bookkeeping", "advisory", "quickbooks"],
  },
  {
    id: "quickbooks",
    name: "QuickBooks Setup and Cleanup",
    category: "Accounting",
    summary: "A file that matches the bank, with categories you recognize.",
    tagline: "Start clean, or repair a file that no longer matches the bank.",
    minutes: 60,
    freeIntro: false,
    popular: true,
    catalog: true,
    image: "svc-quickbooks.jpg",
    overview: [
      "A new QuickBooks file should mirror how the business actually runs: the right bank accounts, sales tax settings if you collect it, and categories an owner can read. We set that up with you.",
      "A cleanup is for files that have doubled income, unreconciled months, or a category list that grew wild. We reconcile to the statements, merge duplicates, and leave you with a month that ties.",
      "We work in QuickBooks Online. If you are on desktop software, tell us before the visit so we can plan the file transfer.",
    ],
    included: [
      "Chart of accounts shaped around your business",
      "Bank and credit card connections or statement import",
      "Reconciliation of the cleanup period",
      "A short lesson so you can keep the file tidy",
    ],
    audience: ["New businesses opening their first file", "Owners with a messy QuickBooks", "Bookkeepers handing a file to a CPA"],
    steps: [
      { title: "Book", body: "Say whether this is a new file or a cleanup, and how many months look wrong." },
      { title: "Share access", body: "Invite us as accountant, or send the accountant's copy. Include bank statements for the messy months." },
      { title: "Review with your CPA", body: "We show you what was duplicated, what was recategorized, and what still needs your memory." },
      { title: "Delivery", body: "You get a reconciled file and a one-page list of habits that keep it that way." },
    ],
    documents: [
      { title: "Bank statements", detail: "PDF statements for each month in the cleanup, even if the bank is connected." },
      { title: "The current file", detail: "An accountant invite is best. A backup is the fallback." },
      { title: "Loan and sales tax logins", detail: "Only if those balances need to be rebuilt. We would rather you stay logged in and share a screen." },
    ],
    faqs: [
      { q: "Should I start a brand-new file?", a: "Sometimes. If the old file has years of duplicated income, a clean start at a known date can be kinder. We will recommend one path after we look." },
      { q: "Will I still be able to use the file myself?", a: "Yes. The point is a file you can live in. We will show you the three screens that matter." },
      { q: "Do you support other software?", a: "The setup service is for QuickBooks. If you use something else, book a consultation and we will tell you whether we can work from exports." },
    ],
    related: ["bookkeeping", "financial-statements", "advisory"],
  },
  {
    id: "business-formation",
    name: "Business Formation and Entity Selection",
    category: "Business",
    summary: "Choose and form an LLC or S corporation with your eyes open.",
    tagline: "The right entity for how you actually work, not a form picked off a website.",
    minutes: 45,
    freeIntro: true,
    catalog: true,
    image: "svc-formation.jpg",
    overview: [
      "Forming a company is easy to rush and annoying to undo. We talk through liability, how you want to be taxed, and what Nevada requires before you file anything.",
      "Many Las Vegas owners compare a sole proprietorship, an LLC, and an S corporation. The better fit depends on profit, payroll, partners, and how you want to pay yourself. We lay out the tradeoffs. We do not promise tax savings.",
      "If you decide to form an entity, we outline the filings and the follow-up, including the state business license and annual list. An attorney should review operating agreements when ownership is shared. We will tell you when that is the case.",
    ],
    included: [
      "A comparison of sole prop, LLC, and S corporation",
      "A formation checklist for the path you choose",
      "Help preparing the formation paperwork you assign to us",
      "A list of the first-year tax and license follow-ups",
    ],
    audience: ["New entrepreneurs", "Side businesses becoming real", "Partners forming an LLC together", "Owners considering an S election"],
    steps: [
      { title: "Book", body: "Share who the owners will be and whether you have started selling yet." },
      { title: "Share documents", body: "A draft name, owner names, and any paperwork you already filed." },
      { title: "Review with your CPA", body: "We compare structures and the ongoing costs, including payroll if an S corporation needs it." },
      { title: "Delivery", body: "You leave with a checklist. We file only the items you ask us to file." },
    ],
    documents: [
      { title: "Owner information", detail: "Legal names, addresses, and ownership percentages." },
      { title: "Name ideas", detail: "Two or three business names, in case the first is taken." },
      { title: "Anything already filed", detail: "Articles, an EIN letter, or a city license if you started without a full plan." },
    ],
    faqs: [
      { q: "Do I need an LLC to be legitimate?", a: "No. Plenty of sole proprietors file a Schedule C and do just fine. An LLC or corporation is a tool, not a badge." },
      { q: "Can you write my operating agreement?", a: "We can outline the tax and ownership items to cover. A shared-ownership agreement should be reviewed by a business attorney. We will say so plainly." },
      { q: "How long does formation take?", a: "Nevada filings are often quick, but names, licenses, and bank accounts add time. We will give you a sequence rather than a single promise date." },
    ],
    related: ["nevada-compliance", "business-tax", "consultation"],
  },
  {
    id: "nevada-compliance",
    name: "Nevada Business Compliance",
    category: "Business",
    summary: "State business license, annual list, and commerce tax guidance.",
    tagline: "The Nevada filings that keep a company in good standing.",
    minutes: 30,
    freeIntro: false,
    catalog: true,
    image: "svc-nevada.jpg",
    overview: [
      "Nevada companies have a rhythm of their own: the state business license, the annual list, and, for some businesses, commerce tax. Missing one can lead to fees or a revoked status that surprises you at the worst time.",
      "We review what your entity has already filed and what is coming due. Commerce tax is based on Nevada gross revenue and does not apply to every business. We will tell you if you appear to be under the threshold.",
      "City and county licenses are separate. If your location needs one, we will point it out, and you can ask us to help prepare it.",
    ],
    included: [
      "A check of state business license status",
      "Annual list timing and preparation when you ask us to file",
      "Commerce tax threshold review",
      "A calendar of the Nevada items that apply to you",
    ],
    audience: ["Nevada LLCs and corporations", "Out-of-state owners with a Nevada entity", "Storefront businesses", "Anyone who received a state notice"],
    steps: [
      { title: "Book", body: "Tell us the entity name and whether you have a Nevada business license yet." },
      { title: "Share documents", body: "Articles, the last annual list, and any state letter." },
      { title: "Review with your CPA", body: "We map what is due and what does not apply." },
      { title: "Filing", body: "We prepare the items you want us to file and send you proof." },
    ],
    documents: [
      { title: "Formation documents", detail: "Articles of organization or incorporation and the EIN letter." },
      { title: "Last annual list", detail: "The filed list, or a note if you are not sure it was filed." },
      { title: "Gross revenue figure", detail: "Nevada gross revenue for the commerce tax year, if you are near the filing range." },
    ],
    faqs: [
      { q: "Is the annual list the same as a tax return?", a: "No. The annual list keeps the entity on the state's records. The income tax return is a separate filing with the IRS." },
      { q: "Do I owe commerce tax?", a: "Only if Nevada gross revenue is over the threshold in effect for that year. We check the figure with you rather than assuming." },
      { q: "I ignored a letter. Now what?", a: "Bring it. Many status problems can be repaired by filing the missing list and paying the state fee. We cannot promise penalties will be removed." },
    ],
    related: ["business-formation", "sales-payroll-tax", "bookkeeping"],
  },
  {
    id: "advisory",
    name: "Small Business Advisory and CFO Support",
    category: "Advisory",
    summary: "Budgeting, cash flow, and a sounding board for growth.",
    tagline: "A practical outside look at cash, margins, and the next hire or location.",
    minutes: 60,
    freeIntro: true,
    catalog: true,
    image: "svc-advisory.jpg",
    overview: [
      "Advisory work is for owners who want a thinking partner, not another report that sits in a drawer. We look at cash flow, margins, and the decision in front of you: a hire, a second location, a slow season, or a price change.",
      "CFO support can be monthly or a single deep session. We use your books as the source. If the books are behind, we will fix that first so the advice sits on real numbers.",
      "We share judgment and options. We do not promise growth, a loan approval, or a specific profit.",
    ],
    included: [
      "A cash-flow and margin review",
      "A simple budget or hiring check",
      "Discussion of the decision you came in with",
      "A short list of actions for the next 90 days",
    ],
    audience: ["Owners ready to grow", "Businesses with tight cash", "People considering a second location", "Freelancers building a small team"],
    steps: [
      { title: "Book", body: "Name the decision. A hire, a lease, and a pricing question need different prep." },
      { title: "Share documents", body: "Recent profit and loss, a cash balance, and any offer or lease you are weighing." },
      { title: "Review with your CPA", body: "We pressure-test the numbers and the assumptions." },
      { title: "Delivery", body: "You leave with a 90-day list. Monthly support is available if you want a standing rhythm." },
    ],
    documents: [
      { title: "Recent books", detail: "Three to twelve months of profit and loss, plus a current cash balance." },
      { title: "The decision on paper", detail: "A lease draft, a wage offer, or a quote for equipment. Optional, but useful." },
      { title: "Debt list", detail: "Balances and monthly payments, so cash flow is honest." },
    ],
    faqs: [
      { q: "Is this only for large companies?", a: "No. Most of this work is for owners who still know their customers by name." },
      { q: "How is this different from bookkeeping?", a: "Bookkeeping records the past. Advisory uses those records to talk about a decision. Many clients do both." },
      { q: "Can you attend a meeting with my lender?", a: "Sometimes. Ask us when you book and we will tell you if that meeting is in scope." },
    ],
    related: ["financial-statements", "tax-planning", "bookkeeping"],
  },
  {
    id: "consultation",
    name: "General Consultation",
    category: "Advisory",
    summary: "A first full visit when you want advice, not a specific form.",
    tagline: "Bring the question you have been carrying. Leave with a plan for what to do next.",
    minutes: 30,
    freeIntro: true,
    popular: true,
    catalog: true,
    image: "svc-consult.jpg",
    overview: [
      "A general consultation is the right first visit when you are not sure which service you need. New clients use it to tell the story once: the business, the worry, and what a good outcome looks like.",
      "Thirty minutes is enough to understand the issue and recommend a service, a document list, or a longer project. It is not enough to prepare a return or rebuild a year of books. If that is what you need, we will book it as its own appointment.",
      "A free 15-minute intro call is available if you want to confirm this is the right room before you take a half hour.",
    ],
    included: [
      "Time with a CPA to describe your situation",
      "A recommendation for the service that fits",
      "A document list for the next step",
      "Straight talk if we are not the right firm",
    ],
    audience: ["First-time clients", "People with a one-off question", "Owners comparing firms", "Anyone who wants a human answer"],
    steps: [
      { title: "Book", body: "Pick 30 minutes and write one or two sentences about the question." },
      { title: "Share documents", body: "Optional. A notice, a return, or nothing at all." },
      { title: "Review with your CPA", body: "We listen first, then tell you what we would do next." },
      { title: "Delivery", body: "You get a recommended service and, if you want it, a follow-up appointment." },
    ],
    documents: [
      { title: "Whatever sparked the visit", detail: "A letter, a spreadsheet, or a question in your own words. Nothing is mandatory." },
    ],
    faqs: [
      { q: "Is the consultation free?", a: "The 15-minute intro call is free. This 30-minute consultation is a working meeting, and the fee is discussed when you book if a fee applies. We will not start paid work without saying so." },
      { q: "Can I cover several topics?", a: "Pick the one that matters most. We would rather go deep on one question than rush through five." },
      { q: "Will this make you my CPA of record?", a: "Not by itself. An ongoing engagement starts when we both agree to the work in writing." },
    ],
    related: ["individual-tax", "business-tax", "bookkeeping"],
  },
];

export function getService(id: string) {
  return services.find((service) => service.id === id);
}

export function catalogServices() {
  return services.filter((service) => service.catalog);
}

export function bookableServices() {
  const intro = services.find((service) => service.id === "intro-call");
  return intro ? [intro, ...catalogServices()] : catalogServices();
}
