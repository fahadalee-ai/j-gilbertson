import { useNavigate } from "@tanstack/react-router";
import { Building2, CalendarPlus, FileText, MapPin, Phone, Share2, Video } from "lucide-react";
import { useState } from "react";
import { CalendarPicker } from "@/components/CalendarPicker";
import { Button, CheckMark, EmptyState, Page, Segmented, StatusBadge } from "@/components/mobile";
import { useOverlay } from "@/components/mobile";
import { cancelReasons, firm, isSlotOpen, slotGroups } from "@/lib/content";
import { longDate, shortDate } from "@/lib/format";
import { haptic } from "@/lib/haptics";
import { getService } from "@/lib/services";
import { useApp, type ApptStatus, type Appointment } from "@/lib/store";

const filters = [
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
] as const;

type Filter = (typeof filters)[number]["id"];

function matches(status: ApptStatus, filter: Filter) {
  if (filter === "upcoming") return status === "confirmed" || status === "pending";
  if (filter === "completed") return status === "completed";
  return status === "cancelled";
}

export function AppointmentsScreen() {
  const navigate = useNavigate();
  const { user, appointments, beginBooking, pushToast, cancelAppointment } = useApp();
  const { openSheet, closeSheet, openAlert } = useOverlay();
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [loading, setLoading] = useState(false);
  const mine = appointments.filter((item) => item.userId === user?.id && matches(item.status, filter));

  const openActions = (appointment: Appointment) => {
    const service = getService(appointment.serviceId);
    openSheet({
      title: service?.name ?? "Appointment",
      content: (
        <div className="space-y-2 pb-2">
          <Button onClick={() => { closeSheet(); navigate({ to: "/appointments/$appointmentId", params: { appointmentId: appointment.id } }); }}>View Details</Button>
          {appointment.status === "confirmed" && (
            <Button variant="secondary" onClick={() => { closeSheet(); navigate({ to: "/appointments/$appointmentId", params: { appointmentId: appointment.id }, search: { reschedule: "1" } }); }}>Reschedule</Button>
          )}
          {appointment.status === "confirmed" && (
            <Button variant="destructive" onClick={() => { closeSheet(); askCancel(appointment); }}>Cancel Appointment</Button>
          )}
        </div>
      ),
    });
  };

  const askCancel = (appointment: Appointment) => {
    openSheet({
      title: "Why are you cancelling?",
      content: (
        <div>
          {cancelReasons.map((reason) => (
            <button
              key={reason}
              type="button"
              className="flex min-h-[52px] w-full items-center border-t border-divider text-left text-[17px] first:border-t-0"
              onClick={() => {
                closeSheet();
                openAlert({
                  title: "Cancel this appointment?",
                  message: "This frees the time. You can book again whenever you are ready.",
                  actions: [
                    { label: "Keep it", role: "cancel" },
                    {
                      label: "Cancel Appointment",
                      role: "destructive",
                      onPress: () => {
                        cancelAppointment(appointment.id, reason);
                        haptic("warning");
                        pushToast("Appointment cancelled", reason);
                      },
                    },
                  ],
                });
              }}
            >
              {reason}
            </button>
          ))}
        </div>
      ),
    });
  };

  return (
    <Page
      title="Appointments"
      large
      onRefresh={async () => {
        setLoading(true);
        await new Promise((resolve) => window.setTimeout(resolve, 700));
        setLoading(false);
        pushToast("Appointments updated");
      }}
    >
      <div className="px-5 pb-4">
        <Segmented label="Appointment status" value={filter} onChange={setFilter} options={filters.map((item) => ({ id: item.id, label: item.label }))} />
      </div>
      {!user ? (
        <EmptyState
          image="onboarding-booking.jpg"
          imageAlt="A person booking an appointment"
          title="Sign in to see your visits"
          body="Guest browsing keeps services open. Appointments are saved to your account."
          action="Log In"
          onAction={() => navigate({ to: "/login" })}
        />
      ) : loading ? (
        <div className="space-y-3 px-5">
          {[0, 1].map((item) => (
            <div key={item} className="skel h-28 rounded-[20px]" />
          ))}
        </div>
      ) : mine.length === 0 ? (
        <EmptyState
          image="onboarding-organized.jpg"
          imageAlt="An organized desk"
          title={filter === "upcoming" ? "No upcoming visits" : filter === "completed" ? "No completed visits yet" : "No cancelled visits"}
          body={filter === "upcoming" ? "Book a time and it will show up here with reminders." : "When a visit is finished or cancelled, it will be listed in this tab."}
          action={filter === "upcoming" ? "Book Appointment" : undefined}
          onAction={filter === "upcoming" ? () => { beginBooking(); navigate({ to: "/book" }); } : undefined}
        />
      ) : (
        <div className="space-y-3 px-5">
          {mine.map((appointment) => {
            const service = getService(appointment.serviceId);
            const Icon = appointment.meetingType === "phone" ? Phone : appointment.meetingType === "video" ? Video : Building2;
            return (
              <article
                key={appointment.id}
                onContextMenu={(event) => {
                  event.preventDefault();
                  openActions(appointment);
                }}
                className="rounded-[20px] bg-card p-4 shadow-card"
              >
                <button type="button" className="w-full text-left" onClick={() => navigate({ to: "/appointments/$appointmentId", params: { appointmentId: appointment.id } })}>
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-[17px] font-semibold leading-snug">{service?.name}</span>
                    <StatusBadge status={appointment.status} />
                  </span>
                  <span className="mt-2 flex items-center gap-2 text-[15px] text-muted-foreground">
                    <Icon size={16} className="text-sky" />
                    {shortDate(appointment.date)} · {appointment.time}
                  </span>
                </button>
                {appointment.status === "confirmed" && (
                  <div className="mt-3 flex gap-2">
                    <button type="button" className="min-h-11 flex-1 rounded-[12px] bg-muted text-[15px] font-semibold" onClick={() => navigate({ to: "/appointments/$appointmentId", params: { appointmentId: appointment.id }, search: { reschedule: "1" } })}>
                      Reschedule
                    </button>
                    <button type="button" className="min-h-11 flex-1 rounded-[12px] bg-[color-mix(in_srgb,var(--destructive)_12%,transparent)] text-[15px] font-semibold text-destructive" onClick={() => askCancel(appointment)}>
                      Cancel
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </Page>
  );
}

export function AppointmentDetailScreen({ appointmentId, startReschedule = false }: { appointmentId: string; startReschedule?: boolean }) {
  const navigate = useNavigate();
  const { appointments, user, reschedule, cancelAppointment, pushToast } = useApp();
  const { openSheet, closeSheet, openAlert, ask } = useOverlay();
  const appointment = appointments.find((item) => item.id === appointmentId && item.userId === user?.id);
  const [mode, setMode] = useState<"view" | "reschedule" | "done">(startReschedule ? "reschedule" : "view");
  const [date, setDate] = useState(appointment?.date ?? null);
  const [time, setTime] = useState<string | null>(null);

  if (!appointment) {
    return (
      <Page title="Appointment" back>
        <p className="px-5 text-[17px]">That appointment is not on this account.</p>
      </Page>
    );
  }

  const service = getService(appointment.serviceId);

  if (mode === "done") {
    return (
      <div className="flex h-full flex-col px-5 pb-8 pt-10">
        <CheckMark />
        <h1 className="mt-5 text-center text-[28px] font-bold">Appointment rescheduled</h1>
        <p className="mt-2 text-center text-[17px] text-muted-foreground">{date ? longDate(date) : ""} · {time}</p>
        <div className="mt-auto space-y-3">
          <Button onClick={() => navigate({ to: "/appointments" })}>Go to Appointments</Button>
          <Button variant="ghost" onClick={() => navigate({ to: "/home" })}>Back to Home</Button>
        </div>
      </div>
    );
  }

  if (mode === "reschedule") {
    return (
      <Page title="Reschedule" back onBack={() => setMode("view")}>
        <div className="px-5">
          <p className="mb-3 text-[17px] font-semibold">{service?.name}</p>
          <CalendarPicker value={date} onChange={(next) => { setDate(next); setTime(null); }} />
          {date && (
            <div className="mt-4 space-y-4">
              {slotGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 text-[15px] font-semibold">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.slots.map((slot) => {
                      const open = isSlotOpen(date, slot);
                      const selected = time === slot;
                      return (
                        <button key={slot} type="button" disabled={!open} onClick={() => { haptic("light"); setTime(slot); }} className={`min-h-11 rounded-full px-3 text-[15px] font-semibold ${selected ? "bg-primary text-white" : open ? "bg-card shadow-card" : "bg-muted text-muted-foreground line-through"}`}>
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-5">
            <Button
              disabled={!date || !time}
              onClick={() => {
                if (!date || !time) return;
                reschedule(appointment.id, date, time);
                haptic("success");
                setMode("done");
              }}
            >
              Confirm New Time
            </Button>
          </div>
        </div>
      </Page>
    );
  }

  const place = appointment.meetingType === "in-office" ? `${firm.addressLine}, ${firm.cityLine}` : appointment.meetingType === "phone" ? "Phone call to the number on your profile." : "Video link emailed before the appointment.";

  return (
    <Page title="Appointment" back>
      <div className="space-y-4 px-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-semibold leading-tight">{service?.name}</h2>
          <StatusBadge status={appointment.status} />
        </div>
        <div className="rounded-[20px] bg-card p-4 shadow-card">
          <p className="text-[17px]">{longDate(appointment.date)}</p>
          <p className="text-[17px]">{appointment.time} · {service?.minutes} min</p>
          <p className="mt-2 text-[15px] text-muted-foreground">{place}</p>
          <p className="mt-2 text-[13px] text-muted-foreground">{firm.timezone}</p>
        </div>
        {appointment.meetingType === "in-office" && (
          <iframe title="Office location" className="h-36 w-full rounded-[16px] border-0" src="https://www.openstreetmap.org/export/embed.html?bbox=-115.132%2C36.026%2C-115.108%2C36.042&layer=mapnik&marker=36.034013%2C-115.120082" />
        )}
        <div className="rounded-[20px] bg-card p-4 shadow-card text-[15px] leading-relaxed">
          <p><span className="text-muted-foreground">CPA · </span>{appointment.cpa}</p>
          <p className="mt-1"><span className="text-muted-foreground">Reference · </span>{appointment.reference}</p>
          {appointment.notes && <p className="mt-2">{appointment.notes}</p>}
          {appointment.cancelReason && <p className="mt-2">Cancelled: {appointment.cancelReason}</p>}
        </div>
        {appointment.documents.length > 0 && (
          <div className="rounded-[16px] bg-card shadow-card">
            {appointment.documents.map((doc) => (
              <div key={doc.id} className="flex min-h-[52px] items-center gap-3 border-t border-divider px-4 first:border-t-0">
                <FileText className="text-sky" size={18} />
                <span className="flex-1 text-[15px]">{doc.name}</span>
                <span className="text-[13px] text-muted-foreground">{doc.kind}</span>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={async () => {
              const allowed = await ask("Calendar", "KJ Gilbertson CPA would like to add this appointment to your calendar.");
              if (!allowed) return;
              pushToast("Saved to calendar", "An event file was downloaded for this visit.");
            }}
          >
            <CalendarPlus size={18} /> Add to Calendar
          </Button>
          {appointment.meetingType === "in-office" ? (
            <Button variant="secondary" onClick={() => window.open(firm.mapsUrl, "_blank", "noopener,noreferrer")}>
              <MapPin size={18} /> Get Directions
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => pushToast(appointment.meetingType === "video" ? "Join link" : "Phone visit", appointment.meetingType === "video" ? "Your link arrives by email about 15 minutes ahead." : "We call you at the scheduled time.")}>
              {appointment.meetingType === "video" ? "Join Link" : "Call Details"}
            </Button>
          )}
        </div>
        <Button variant="secondary" onClick={() => { window.location.href = `tel:${firm.phoneTel}`; }}>Call Office</Button>
        <Button
          variant="secondary"
          onClick={async () => {
            const text = `${service?.name} on ${longDate(appointment.date)} at ${appointment.time}. Reference ${appointment.reference}.`;
            if (navigator.share) await navigator.share({ title: "Appointment", text });
            else {
              await navigator.clipboard.writeText(text);
              pushToast("Copied");
            }
          }}
        >
          <Share2 size={18} /> Share
        </Button>
        {appointment.status === "confirmed" && (
          <>
            <Button onClick={() => setMode("reschedule")}>Reschedule</Button>
            <Button
              variant="destructive"
              onClick={() => {
                openSheet({
                  title: "Why are you cancelling?",
                  content: (
                    <div>
                      {cancelReasons.map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          className="flex min-h-[52px] w-full items-center border-t border-divider text-left text-[17px] first:border-t-0"
                          onClick={() => {
                            closeSheet();
                            openAlert({
                              title: "Cancel this appointment?",
                              message: reason,
                              actions: [
                                { label: "Keep it", role: "cancel" },
                                {
                                  label: "Cancel Appointment",
                                  role: "destructive",
                                  onPress: () => {
                                    cancelAppointment(appointment.id, reason);
                                    haptic("warning");
                                    pushToast("Appointment cancelled");
                                  },
                                },
                              ],
                            });
                          }}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                  ),
                });
              }}
            >
              Cancel Appointment
            </Button>
          </>
        )}
      </div>
    </Page>
  );
}
