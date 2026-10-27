/**
 * Firm details, hours, tax dates, team, and policies.
 * Marked as editable sample content so the firm can update them before launch.
 */

export const firm = {
  name: "KJ Gilbertson CPA LLC",
  shortName: "KJ Gilbertson CPA",
  tagline: "Tax and Accounting for Small Business",
  addressLine: "8565 S Eastern Avenue #100",
  cityLine: "Las Vegas, NV 89123",
  phoneDisplay: "(702) 714-1433",
  phoneTel: "+17027141433",
  /** Sample address. Replace with the firm's real inbox before publishing. */
  email: "info@kjgilbertsoncpa.com",
  lat: 36.034013,
  lng: -115.120082,
  timezone: "Pacific Time (Las Vegas)",
  mapsUrl:
    "https://maps.apple.com/?ll=36.034013,-115.120082&q=KJ%20Gilbertson%20CPA%20LLC&address=8565%20S%20Eastern%20Avenue,%20Las%20Vegas,%20NV%2089123",
  hoursNote: "Office hours below are a sample and should be confirmed by the firm.",
  hours: [
    { days: "Monday – Friday", hours: "9:00 AM – 5:00 PM" },
    { days: "Saturday", hours: "Closed" },
    { days: "Sunday", hours: "Closed" },
  ],
  parking:
    "The suite is in Eastern Executive Suites at Canyon Plaza, on South Eastern Avenue near Wigwam, just north of I-215. The building has a surface parking lot. The lobby has step-free access. Call ahead if you need a specific accommodation.",
};

export const feeNote = "Fee discussed during consultation.";

export const privacyNote = "Your information is kept confidential and secure.";

export const cancellationPolicy =
  "You can reschedule or cancel without a fee up to 24 hours before your appointment. Inside 24 hours, call the office and we will do our best to help. This note is sample policy text the firm can edit.";

export type MeetingType = "in-office" | "phone" | "video";

export const meetingOptions: { id: MeetingType; title: string; body: string }[] = [
  {
    id: "in-office",
    title: "In-Office",
    body: "Meet us at 8565 S Eastern Avenue #100 in Las Vegas. Free parking is in the building lot.",
  },
  {
    id: "phone",
    title: "Phone Call",
    body: "We call you at the number you provide. A quiet spot and your questions are all you need.",
  },
  {
    id: "video",
    title: "Video Call",
    body: "A secure link is emailed before the appointment. Join from a phone or computer.",
  },
];

export const slotGroups = [
  { label: "Morning", slots: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"] },
  { label: "Afternoon", slots: ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"] },
  { label: "Evening", slots: ["4:00 PM", "4:30 PM", "5:00 PM"] },
];

/** 5:00 PM is shown but closed because the office day ends at 5:00. Other slots vary so the grid feels real. */
export function isSlotOpen(date: string, time: string) {
  if (time === "5:00 PM") return false;
  const n = [...`${date}${time}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return n % 7 !== 0;
}

export const cancelReasons = [
  "Schedule conflict",
  "I need a different service",
  "I booked this by mistake",
  "Something else came up",
];

/** Informational federal dates. The firm can edit this list. Not tax advice. */
export const taxDates = [
  {
    id: "941-q3-2026",
    label: "Form 941, 3rd quarter",
    detail: "Quarterly payroll tax report for employers.",
    date: "2026-10-31",
  },
  {
    id: "corp-q4-2026",
    label: "Corporate estimated tax",
    detail: "4th quarter estimate for many calendar-year corporations.",
    date: "2026-12-15",
  },
  {
    id: "indiv-q4-2027",
    label: "Individual estimated tax",
    detail: "4th quarter estimate for individuals who pay quarterly.",
    date: "2027-01-15",
  },
  {
    id: "w2-2027",
    label: "W-2 and 1099 forms",
    detail: "Employers furnish wage and information statements.",
    date: "2027-01-31",
  },
  {
    id: "1120s-2027",
    label: "S-Corp and partnership returns",
    detail: "Calendar-year Forms 1120-S and 1065.",
    date: "2027-03-15",
  },
  {
    id: "1040-2027",
    label: "Individual tax returns",
    detail: "Form 1040 and the 1st quarter individual estimate.",
    date: "2027-04-15",
  },
];

export const whyChoose = [
  { title: "Small Business Specialists", body: "Built for owners, freelancers, and local teams.", icon: "store" },
  { title: "Licensed CPA", body: "A certified public accountant leads the work.", icon: "badge" },
  { title: "Year-Round Support", body: "Help before, during, and after filing season.", icon: "calendar" },
  { title: "Personalized Advice", body: "Plain-language answers for your situation.", icon: "chat" },
];

export const team = [
  {
    id: "kj",
    name: "KJ Gilbertson",
    title: "CPA, Principal",
    credentials: "Certified Public Accountant",
    image: "cpa-principal.jpg",
    bio: "KJ works with Las Vegas owners who want the numbers explained in plain language. The day-to-day work is bookkeeping that stays current, returns filed on time, and advice you can use in the business.",
  },
  {
    id: "andre",
    name: "Andre Cole",
    title: "CPA, Tax Manager",
    credentials: "Certified Public Accountant",
    image: "cpa-associate.jpg",
    bio: "Andre helps clients sort payroll tax, notices, and year-end questions. He keeps meetings calm and leaves you with a clear next step.",
  },
];

export const testimonials = [
  {
    id: "denise",
    name: "Denise Calderon",
    business: "Cafe owner",
    stars: 5,
    avatar: "avatar-denise.jpg",
    quote:
      "I finally understand my monthly numbers. The team explains things without talking down to me, and tax season felt manageable.",
  },
  {
    id: "marcus",
    name: "Marcus Webb",
    business: "General contractor",
    stars: 5,
    avatar: "avatar-marcus.jpg",
    quote:
      "Job costs and payroll used to pile up in a folder. Now I know what is due and when, and I can book time before the deadline sneaks up.",
  },
  {
    id: "aisha",
    name: "Aisha Rahman",
    business: "Freelance designer",
    stars: 5,
    avatar: "avatar-aisha.jpg",
    quote:
      "As a solo business, I wanted someone who would treat my return with the same care as a bigger client. Booking the first call took a few minutes.",
  },
];

export const values = [
  { title: "Plain language", body: "We skip the jargon unless you ask for it, and we tell you why a step matters." },
  { title: "Confidential care", body: "Your records stay between you and the firm. We do not sell your information." },
  { title: "Local focus", body: "The practice is built around Las Vegas individuals and small businesses." },
  { title: "Steady follow-through", body: "You get a next step, a reminder, and a person to call if something changes." },
];

export const onboarding = [
  {
    image: "onboarding-advise.jpg",
    alt: "A CPA meeting with a small business owner at a bright desk",
    title: "Expert Tax and Accounting, Made Simple",
    body: "From small business bookkeeping to tax filing, our CPA team handles the numbers so you can focus on growing your business.",
  },
  {
    image: "onboarding-booking.jpg",
    alt: "A person booking an appointment on a smartphone",
    title: "Book Your Consultation in Minutes",
    body: "Choose a service, pick a date and time that works for you, and meet us in person, by phone, or by video.",
  },
  {
    image: "onboarding-organized.jpg",
    alt: "An organized desk with documents and a tablet showing a financial dashboard",
    title: "Stay Organized and Stress-Free",
    body: "Track your appointments, get reminders, and securely share your documents, all in one place.",
  },
];

export type FaqGroup = { id: string; title: string; items: { q: string; a: string }[] };

export const faqs: FaqGroup[] = [
  {
    id: "appointments",
    title: "Appointments",
    items: [
      {
        q: "How do I book a consultation?",
        a: "Choose a service, pick in-office, phone, or video, then select a date and time in Pacific Time. You will review the details before anything is confirmed. Guests can browse first and sign in at the last step.",
      },
      {
        q: "Can I reschedule or cancel?",
        a: "Yes. Open the appointment and choose Reschedule or Cancel. Changes are easiest at least 24 hours ahead. If you are inside that window, call the office and we will try to help.",
      },
      {
        q: "What if I am running late?",
        a: "Call (702) 714-1433. If it is a phone or video visit, we can often start a few minutes later. For an office visit, tell us you are on the way so we can hold the room if we can.",
      },
      {
        q: "Which meeting type should I choose?",
        a: "Come in if you want to review a stack of papers together. Choose phone for a short question. Choose video if you want to share a screen and still talk face to face.",
      },
    ],
  },
  {
    id: "documents",
    title: "Documents",
    items: [
      {
        q: "What should I bring?",
        a: "It depends on the service. Each service page lists documents you may need. If you are missing something, book anyway. We would rather start than wait for a perfect folder.",
      },
      {
        q: "Are my files private?",
        a: "Yes. Documents you share are for your CPA engagement. They are not used for advertising and they are not sold. This preview stores files only on your device.",
      },
      {
        q: "Which file types can I attach?",
        a: "PDF and photos work best. A clear photo of a form is fine if you do not have a scan. Name the file so we can tell what it is.",
      },
    ],
  },
  {
    id: "fees",
    title: "Fees and Billing",
    items: [
      {
        q: "How much will this cost?",
        a: "The fee is discussed during the consultation, after we understand the work. We do not quote a final fee from a menu, and we do not promise a refund or a savings amount.",
      },
      {
        q: "When do I pay?",
        a: "We explain timing before work begins. Many projects are billed when the return or report is ready to file or deliver. You will not be surprised by a charge.",
      },
      {
        q: "Do you require a retainer?",
        a: "Some ongoing bookkeeping and notice work does. We will say so before you agree to anything.",
      },
    ],
  },
  {
    id: "tax",
    title: "Tax Basics",
    items: [
      {
        q: "When should I talk to a CPA?",
        a: "A good time is before a big change: a new business, a first employee, a home sale, or a letter from the IRS. You do not need to wait for April.",
      },
      {
        q: "What is the difference between bookkeeping and tax preparation?",
        a: "Bookkeeping records what happened during the year. Tax preparation uses those records to file a return. Clean books make the return faster and more reliable.",
      },
      {
        q: "Can you help with an IRS or state notice?",
        a: "Yes. Bring the letter and we will explain what it is asking and the options we see. We cannot promise a particular outcome, waiver, or dollar result.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy and Security",
    items: [
      {
        q: "Who can see my information?",
        a: "Your CPA and the staff working on your file. We do not share your records for marketing. A legal request or a filing you ask us to submit is different, and we will tell you when that applies.",
      },
      {
        q: "Do you sell client data?",
        a: "No. Client information is not sold.",
      },
      {
        q: "How do reminders work?",
        a: "If you turn reminders on, we can send an email and a phone notification about your appointment and about tax dates you saved. You can turn either one off in Settings.",
      },
    ],
  },
];

export const privacySections = [
  {
    title: "What this policy covers",
    body: "This is sample policy text for the app preview. KJ Gilbertson CPA LLC will replace it with the firm's official privacy policy before the app is published.",
  },
  {
    title: "Information you give us",
    body: "When you create an account or book a visit, we ask for your name, email, phone number, and a short note about what you need. You may also upload documents such as prior returns or financial reports.",
  },
  {
    title: "How we use it",
    body: "We use this information to schedule appointments, prepare for your meeting, send reminders you requested, and provide the tax or accounting service you asked for. We do not sell your information.",
  },
  {
    title: "Who can see it",
    body: "Your records are available to the CPA and staff working on your file. We share information with a tax authority only when you ask us to file, or when the law requires it. We will be direct with you if that happens.",
  },
  {
    title: "How long we keep it",
    body: "Engagement records are kept for the period required by professional standards and Nevada rules. You may ask for a copy of what we hold about you, and you may ask us to delete an account that is not tied to an open engagement.",
  },
  {
    title: "Your choices",
    body: "You can turn appointment and deadline reminders off in Settings. You can also request Face ID on this device, which stays on the phone and is not sent to us.",
  },
];

export const termsSections = [
  {
    title: "Using this app",
    body: "This is sample terms text for the app preview. The firm will replace it with its official terms before publishing. The app helps you learn about services and request an appointment. It does not, by itself, create a CPA-client relationship.",
  },
  {
    title: "No outcome promises",
    body: "Tax and accounting work depends on your facts, the documents you provide, and the rules in effect at the time. We do not guarantee a refund, a savings amount, a penalty waiver, or a particular result with the IRS or the State of Nevada.",
  },
  {
    title: "Appointments",
    body: "A confirmed appointment reserves time on the calendar. Please reschedule or cancel at least 24 hours ahead when you can. The fee for the work, if any, is discussed in the consultation and agreed before we begin.",
  },
  {
    title: "Your responsibilities",
    body: "Please give us accurate information and tell us if something changes. A return or report is only as reliable as the records behind it. You remain responsible for reviewing filings before they are submitted.",
  },
  {
    title: "Accounts",
    body: "Keep your login to yourself. If you use Face ID, anyone whose face is enrolled on this phone may be able to open the app. You can delete the account from Settings when you no longer want it.",
  },
];
