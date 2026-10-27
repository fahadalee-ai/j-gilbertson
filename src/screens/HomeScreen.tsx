import { useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Bell, Briefcase, CalendarClock, CalendarPlus, ChevronRight, MapPin, MessagesSquare, Phone, Store } from "lucide-react";
import { useState } from "react";
import { Button, Card, Logo, Photo, SearchField, SectionTitle, Stars } from "@/components/mobile";
import { firm, privacyNote, taxDates, testimonials, whyChoose } from "@/lib/content";
import { greeting, longDate, monthLabel } from "@/lib/format";
import { catalogServices, getService } from "@/lib/services";
import { useApp } from "@/lib/store";
import { useOverlay } from "@/components/mobile";

const featureIcon = {
  store: Store,
  badge: BadgeCheck,
  calendar: CalendarClock,
  chat: MessagesSquare,
};

export function HomeScreen() {
  const navigate = useNavigate();
  const { user, guest, appointments, notices, reminders, toggleReminder, beginBooking, pushToast } = useApp();
  const { ask } = useOverlay();
  const [query, setQuery] = useState("");
  const [quote, setQuote] = useState(0);
  const upcoming = appointments.find((item) => item.userId === user?.id && (item.status === "confirmed" || item.status === "pending"));
  const upcomingService = upcoming ? getService(upcoming.serviceId) : undefined;
  const unread = notices.some((item) => item.userId === user?.id && !item.read);
  const hello = greeting();
  const name = user ? `, ${user.firstName}` : "";
  const visibleDates = taxDates.filter((item) => new Date(`${item.date}T00:00:00`) >= new Date(new Date().setHours(0, 0, 0, 0)));
  const cpa = {
    name: "KJ Gilbertson",
    title: "CPA, Principal",
    image: "cpa-principal.jpg",
    bio: "A Las Vegas CPA for owners who want the numbers explained in plain language.",
  };

  const remind = async (id: string) => {
    if (!user) {
      pushToast("Sign in to save reminders");
      navigate({ to: "/login" });
      return;
    }
    const allowed = await ask("Notifications", "KJ Gilbertson CPA would like to send you reminders about this date. Dates are informational.");
    if (!allowed) return;
    toggleReminder(id);
    pushToast(reminders.some((item) => item.dateId === id && item.userId === user.id) ? "Reminder removed" : "Reminder saved");
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-4">
      <header className="flex items-center gap-3 px-5 pb-3 pt-2">
        <Logo size={40} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-semibold leading-tight">
            {hello}
            {name}
          </p>
          <p className="text-[13px] text-muted-foreground">How can we help today?</p>
        </div>
        <button type="button" aria-label={unread ? "Notifications, unread" : "Notifications"} onClick={() => navigate({ to: "/notifications" })} className="relative flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-card">
          <Bell size={20} className="text-primary" />
          {unread && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-card" />}
        </button>
      </header>

      <div className="px-5">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search services, e.g. Tax Preparation"
          onSubmit={() => navigate({ to: "/services", search: { q: query } })}
        />
      </div>

      <div className="mt-4 px-5">
        <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(105deg,#4C419A_0%,#4C419A_58%,#2EB4E8_100%)] p-5 text-white shadow-card">
          <Photo src="office-hero.jpg" alt="" className="pointer-events-none absolute inset-y-0 right-0 h-full w-[46%] opacity-70 [mask-image:linear-gradient(90deg,transparent,#000_55%)]" />
          <div className="relative max-w-[70%]">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-white/80">Free intro</p>
            <h2 className="mt-1 text-[22px] font-semibold leading-tight">Book a Free 15-Minute Intro Call</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-white/90">Tell us what you need. We will point you to the right service. No fee for this call.</p>
            <button
              type="button"
              onClick={() => {
                beginBooking("intro-call");
                navigate({ to: "/book" });
              }}
              className="mt-4 min-h-[44px] rounded-[14px] bg-white px-4 text-[16px] font-semibold text-[#1C1B2E]"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 px-3">
        {[
          { label: "Book Appointment", icon: CalendarPlus, action: () => { beginBooking(); navigate({ to: "/book" }); } },
          { label: "Services", icon: Briefcase, action: () => navigate({ to: "/services", search: { q: "" } }) },
          { label: "Call Us", icon: Phone, action: () => { window.location.href = `tel:${firm.phoneTel}`; } },
          { label: "Directions", icon: MapPin, action: () => window.open(firm.mapsUrl, "_blank", "noopener,noreferrer") },
        ].map((item) => (
          <button key={item.label} type="button" onClick={item.action} className="flex min-h-[76px] flex-col items-center gap-1.5 px-1">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-sky shadow-card">
              <item.icon size={22} />
            </span>
            <span className="text-center text-[12px] font-medium leading-tight">{item.label}</span>
          </button>
        ))}
      </div>

      <section className="mt-6">
        <SectionTitle title="Our Services" action="See All" onAction={() => navigate({ to: "/services", search: { q: "" } })} />
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
          {catalogServices().map((service) => (
            <button key={service.id} type="button" onClick={() => navigate({ to: "/services/$serviceId", params: { serviceId: service.id } })} className="w-[210px] shrink-0 overflow-hidden rounded-[20px] bg-card text-left shadow-card">
              <Photo src={service.image} alt="" className="h-28 w-full" />
              <span className="block px-3 pb-3 pt-2">
                <span className="line-clamp-2 block text-[15px] font-semibold leading-snug">{service.name}</span>
                <span className="mt-1 line-clamp-2 block text-[13px] leading-relaxed text-muted-foreground">{service.summary}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-7 px-5">
        <h2 className="mb-3 text-[22px] font-semibold tracking-tight">Upcoming Appointment</h2>
        {upcoming && upcomingService ? (
          <Card className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[17px] font-semibold">{upcomingService.name}</p>
                <p className="mt-1 text-[15px] text-muted-foreground">{longDate(upcoming.date)}</p>
                <p className="text-[15px] text-muted-foreground">{upcoming.time} · {upcoming.meetingType === "in-office" ? "In-Office" : upcoming.meetingType === "phone" ? "Phone" : "Video"}</p>
              </div>
              <span className="rounded-full bg-[color-mix(in_srgb,var(--success)_18%,transparent)] px-2.5 py-1 text-[13px] font-semibold text-[var(--success-ink)]">Confirmed</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => navigate({ to: "/appointments/$appointmentId", params: { appointmentId: upcoming.id } })}>View Details</Button>
              <Button onClick={() => navigate({ to: "/appointments/$appointmentId", params: { appointmentId: upcoming.id }, search: { reschedule: "1" } })}>Reschedule</Button>
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <Photo src="onboarding-booking.jpg" alt="Someone booking a time on a phone" className="h-32 w-full" />
            <div className="p-4">
              <p className="text-[17px] font-semibold">{guest || !user ? "Book your first appointment" : "Nothing on the calendar"}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">Choose a service and a time that works. Most visits start within the week.</p>
              <div className="mt-3">
                <Button onClick={() => { beginBooking(); navigate({ to: "/book" }); }}>Book Appointment</Button>
              </div>
            </div>
          </Card>
        )}
      </section>

      <section className="mt-7">
        <h2 className="mb-3 px-5 text-[22px] font-semibold tracking-tight">Why Choose KJ Gilbertson CPA</h2>
        <div className="grid grid-cols-2 gap-3 px-5">
          {whyChoose.map((item) => {
            const Icon = featureIcon[item.icon as keyof typeof featureIcon] ?? Briefcase;
            return (
              <Card key={item.title} className="p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--sky)_16%,white)] text-sky">
                  <Icon size={18} />
                </span>
                <p className="mt-2 text-[15px] font-semibold leading-snug">{item.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{item.body}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-7">
        <SectionTitle title="Important Tax Dates" />
        <p className="mb-3 px-5 text-[13px] leading-relaxed text-muted-foreground">Informational only. Dates can move if they fall on a weekend or holiday. Confirm them with your CPA. This list is editable by the firm.</p>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-5">
          {visibleDates.map((item) => {
            const on = user ? reminders.some((reminder) => reminder.userId === user.id && reminder.dateId === item.id) : false;
            return (
              <Card key={item.id} className="w-[220px] shrink-0 p-4">
                <p className="text-[13px] font-semibold text-sky">{item.detail}</p>
                <p className="mt-2 text-[17px] font-semibold leading-snug">{item.label}</p>
                <p className="mt-1 text-[15px] text-muted-foreground">{monthLabel(item.date)}</p>
                <button type="button" onClick={() => remind(item.id)} className="mt-3 min-h-11 text-[15px] font-semibold text-primary">
                  {on ? "Reminder on" : "Remind Me"}
                </button>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-7 px-5">
        <h2 className="mb-3 text-[22px] font-semibold tracking-tight">Meet Your CPA</h2>
        <Card className="flex gap-3 p-3">
          <Photo src={cpa.image} alt={`Portrait of ${cpa.name}`} className="h-24 w-24 rounded-[16px]" />
          <div className="min-w-0 flex-1 py-1">
            <p className="text-[17px] font-semibold">{cpa.name}</p>
            <p className="text-[13px] text-sky">{cpa.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{cpa.bio}</p>
            <button type="button" onClick={() => navigate({ to: "/profile/about" })} className="mt-1 inline-flex min-h-11 items-center gap-1 text-[15px] font-semibold text-primary">
              Learn More <ChevronRight size={16} />
            </button>
          </div>
        </Card>
      </section>

      <section className="mt-7">
        <h2 className="mb-3 px-5 text-[22px] font-semibold tracking-tight">What Clients Say</h2>
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5" onScroll={(event) => {
          const width = 280;
          setQuote(Math.round(event.currentTarget.scrollLeft / width));
        }}>
          {testimonials.map((item) => (
            <Card key={item.id} className="w-[280px] shrink-0 snap-start p-4">
              <div className="flex items-center gap-3">
                <Photo src={item.avatar} alt="" className="h-12 w-12 rounded-full" />
                <div>
                  <p className="text-[15px] font-semibold">{item.name}</p>
                  <p className="text-[13px] text-muted-foreground">{item.business}</p>
                </div>
              </div>
              <div className="mt-3">
                <Stars count={item.stars} />
              </div>
              <p className="mt-2 text-[15px] leading-relaxed">{item.quote}</p>
            </Card>
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          {testimonials.map((item, index) => (
            <span key={item.id} className={`h-2 rounded-full ${index === quote ? "w-5 bg-primary" : "w-2 bg-divider"}`} />
          ))}
        </div>
        <p className="mt-2 px-5 text-center text-[12px] text-muted-foreground">Sample comments for this preview.</p>
      </section>

      <section className="mt-7 px-5">
        <h2 className="mb-3 text-[22px] font-semibold tracking-tight">Visit Us</h2>
        <Card className="overflow-hidden">
          <iframe
            title="Map showing 8565 S Eastern Avenue, Las Vegas"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-115.132%2C36.026%2C-115.108%2C36.042&layer=mapnik&marker=36.034013%2C-115.120082"
            className="h-40 w-full border-0"
            loading="lazy"
          />
          <div className="p-4">
            <p className="text-[17px] font-semibold">{firm.addressLine}</p>
            <p className="text-[15px] text-muted-foreground">{firm.cityLine}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => window.open(firm.mapsUrl, "_blank", "noopener,noreferrer")}>Get Directions</Button>
              <Button onClick={() => { window.location.href = `tel:${firm.phoneTel}`; }}>Call</Button>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-7 px-5">
        <Card className="bg-[linear-gradient(135deg,#4C419A,#3d78c4)] p-5 text-white">
          <p className="text-[22px] font-semibold leading-tight">Ready to get started?</p>
          <p className="mt-2 text-[15px] leading-relaxed text-white/90">{privacyNote}</p>
          <button type="button" onClick={() => { beginBooking(); navigate({ to: "/book" }); }} className="mt-4 min-h-[52px] w-full rounded-[14px] bg-white text-[17px] font-semibold text-[#1C1B2E]">
            Book Appointment
          </button>
        </Card>
        {guest && <p className="mt-3 text-center text-[13px] text-muted-foreground">You are browsing as a guest. Sign in when you are ready to confirm a visit.</p>}
      </section>
      <div className="h-2" />
    </div>
  );
}
