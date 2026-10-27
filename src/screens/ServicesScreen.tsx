import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, Clock, MapPin, Phone, Video } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Accordion, Button, NavBar, Page, Photo, PopularBadge, SearchField, SkeletonRows } from "@/components/mobile";
import { feeNote, privacyNote } from "@/lib/content";
import { catalogServices, categories, getService, type ServiceCategory } from "@/lib/services";
import { useApp } from "@/lib/store";

let warmed = false;

export function ServicesScreen({ initialQuery = "" }: { initialQuery?: string }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [loading, setLoading] = useState(!warmed);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!navigator.onLine) setFailed(true);
  }, []);

  useEffect(() => {
    if (warmed) return;
    const timer = window.setTimeout(() => {
      warmed = true;
      setLoading(false);
    }, 700);
    return () => window.clearTimeout(timer);
  }, []);

  const items = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return catalogServices().filter((service) => {
      const categoryOk = category === "All" || service.category === category;
      const text = `${service.name} ${service.summary} ${service.category}`.toLowerCase();
      return categoryOk && (!needle || text.includes(needle));
    });
  }, [query, category]);

  return (
    <Page title="Services" large>
      <div className="space-y-3 px-5 pb-3">
        <SearchField value={query} onChange={setQuery} placeholder="Search services" />
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={`min-h-11 shrink-0 rounded-full px-4 text-[15px] font-semibold ${category === item ? "bg-primary text-white" : "bg-card text-foreground shadow-card"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <SkeletonRows />
      ) : failed ? (
        <div className="px-5">
          <p className="text-[17px] font-semibold">Couldn't load services</p>
          <p className="mt-1 text-[15px] text-muted-foreground">Check your connection and try again.</p>
          <div className="mt-4">
            <Button onClick={() => { setFailed(false); setLoading(true); window.setTimeout(() => setLoading(false), 500); }}>Try Again</Button>
          </div>
        </div>
      ) : items.length === 0 ? (
        <p className="px-5 text-[17px] text-muted-foreground">No services match that search. Try a broader word, like “tax” or “payroll”.</p>
      ) : (
        <div className="space-y-3 px-5">
          {items.map((service, index) => (
            <button
              key={service.id}
              type="button"
              style={{ animationDelay: `${index * 40}ms` }}
              className="rise flex w-full gap-3 rounded-[20px] bg-card p-3 text-left shadow-card"
              onClick={() => navigate({ to: "/services/$serviceId", params: { serviceId: service.id } })}
            >
              <Photo src={service.image} alt="" className="h-20 w-20 shrink-0 rounded-[14px]" />
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-[17px] font-semibold leading-snug">{service.name}</span>
                  {service.popular && <PopularBadge />}
                </span>
                <span className="mt-1 line-clamp-2 block text-[13px] leading-relaxed text-muted-foreground">{service.summary}</span>
                <span className="mt-1 block text-[13px] font-medium text-sky">{service.minutes} min</span>
              </span>
              <ChevronRight className="mt-1 shrink-0 text-muted-foreground" size={18} />
            </button>
          ))}
        </div>
      )}
      {null}
    </Page>
  );
}

export function ServiceDetailScreen({ serviceId }: { serviceId: string }) {
  const navigate = useNavigate();
  const { beginBooking } = useApp();
  const service = getService(serviceId);
  const [y, setY] = useState(0);

  if (!service) {
    return (
      <Page title="Service" back>
        <div className="px-5">
          <p className="text-[17px]">That service is not on the list.</p>
          <div className="mt-4">
            <Button onClick={() => navigate({ to: "/services", search: { q: "" } })}>Back to Services</Button>
          </div>
        </div>
      </Page>
    );
  }

  const related = service.related.map((id) => getService(id)).filter((item) => item && item.catalog);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <NavBar title={service.name} back />
      <div
        className="min-h-0 flex-1 overflow-y-auto no-scrollbar"
        onScroll={(event) => setY(event.currentTarget.scrollTop)}
      >
        <div className="relative h-[148px] overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}images/${service.image}`}
            alt={service.name}
            className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
            style={{ transform: `translateY(${Math.min(y, 120) * 0.25}px)` }}
          />
        </div>
        <div className="bg-background px-5 pb-6 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold text-sky">{service.category}</span>
            {service.popular && <PopularBadge />}
          </div>
          <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">{service.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip icon={<Clock size={14} />} label={`${service.minutes} min`} />
            <Chip icon={<MapPin size={14} />} label="In-Office" />
            <Chip icon={<Phone size={14} />} label="Phone" />
            <Chip icon={<Video size={14} />} label="Video" />
            {service.freeIntro && <Chip label="Free intro call available" />}
          </div>
          <p className="mt-3 text-[13px] text-muted-foreground">{feeNote}</p>

          <h2 className="mt-5 text-[22px] font-semibold">Overview</h2>
          {service.overview.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-3 text-[17px] leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}

          <h2 className="mt-8 text-[22px] font-semibold">What's Included</h2>
          <ul className="mt-3 space-y-3">
            {service.included.map((item) => (
              <li key={item} className="flex gap-3 text-[17px] leading-snug">
                <Check className="mt-0.5 shrink-0 text-success" size={18} /> {item}
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-[22px] font-semibold">Who It's For</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {service.audience.map((item) => (
              <span key={item} className="rounded-full bg-card px-3 py-2 text-[15px] shadow-card">
                {item}
              </span>
            ))}
          </div>

          <h2 className="mt-8 text-[22px] font-semibold">How It Works</h2>
          <ol className="mt-4 space-y-4">
            {service.steps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[15px] font-semibold text-white">{index + 1}</span>
                <span>
                  <span className="block text-[17px] font-semibold">{step.title}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-muted-foreground">{step.body}</span>
                </span>
              </li>
            ))}
          </ol>

          <h2 className="mt-8 text-[22px] font-semibold">Documents You May Need</h2>
          <div className="mt-3 overflow-hidden rounded-[16px] bg-card shadow-card">
            {service.documents.map((doc) => (
              <Accordion key={doc.title} title={doc.title}>
                {doc.detail}
              </Accordion>
            ))}
          </div>

          <h2 className="mt-8 text-[22px] font-semibold">FAQs</h2>
          <div className="mt-3 overflow-hidden rounded-[16px] bg-card shadow-card">
            {service.faqs.map((faq) => (
              <Accordion key={faq.q} title={faq.q}>
                {faq.a}
              </Accordion>
            ))}
          </div>

          {related.length > 0 && (
            <>
              <h2 className="mt-8 text-[22px] font-semibold">Related Services</h2>
              <div className="no-scrollbar -mx-5 mt-3 flex gap-3 overflow-x-auto px-5">
                {related.map((item) =>
                  item ? (
                    <button key={item.id} type="button" onClick={() => navigate({ to: "/services/$serviceId", params: { serviceId: item.id } })} className="w-[200px] shrink-0 overflow-hidden rounded-[16px] bg-card text-left shadow-card">
                      <Photo src={item.image} alt="" className="h-24 w-full" />
                      <span className="block px-3 py-2 text-[15px] font-semibold">{item.name}</span>
                    </button>
                  ) : null,
                )}
              </div>
            </>
          )}
          <p className="mt-6 text-[13px] leading-relaxed text-muted-foreground">{privacyNote}</p>
        </div>
      </div>
      <div className="shrink-0 border-t border-divider bg-background px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <Button
          onClick={() => {
            beginBooking(service.id);
            navigate({ to: "/book" });
          }}
        >
          Book This Service
        </Button>
      </div>
    </div>
  );
}

function Chip({ label, icon }: { label: string; icon?: ReactNode }) {
  return (
    <span className="inline-flex min-h-8 items-center gap-1 rounded-full bg-card px-3 text-[13px] font-medium shadow-card">
      {icon}
      {label}
    </span>
  );
}

export type { ServiceCategory };
