import { useNavigate } from "@tanstack/react-router";
import { Building2, Check, FileText, Phone, Upload, Video } from "lucide-react";
import { useState } from "react";
import { CalendarPicker } from "@/components/CalendarPicker";
import { Button, CheckMark, Field, NavBar, Page, SearchField, Segmented, TextArea, Toggle } from "@/components/mobile";
import { cancellationPolicy, firm, isSlotOpen, meetingOptions, privacyNote, slotGroups, type MeetingType } from "@/lib/content";
import { fileKind, formatPhone, longDate } from "@/lib/format";
import { haptic } from "@/lib/haptics";
import { bookableServices, getService } from "@/lib/services";
import { useApp } from "@/lib/store";

const icons = { "in-office": Building2, phone: Phone, video: Video };

export function BookScreen() {
  const navigate = useNavigate();
  const app = useApp();
  const { booking, setBooking, confirmBooking, pushToast } = app;
  const [query, setQuery] = useState("");
  const service = (getService(booking.serviceId ?? "consultation") ?? getService("consultation"))!;
  const step = booking.step;

  const go = (next: number) => setBooking({ step: next });

  const confirm = () => {
    const appointment = confirmBooking();
    if (!appointment) {
      pushToast("Couldn't confirm", "Choose a service and try again.");
      return;
    }
    haptic("success");
  };

  if (step === 6 && service) {
    return (
      <div className="flex h-full min-h-0 flex-col">
      <NavBar title="Confirmed" back onBack={() => navigate({ to: "/home" })} />
      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-5 pb-8 pt-6">
        <CheckMark />
        <h1 className="mt-5 text-center text-[28px] font-bold leading-tight">Your appointment is booked</h1>
        <p className="mt-2 text-center text-[17px] text-muted-foreground">Reference {booking.reference}</p>
        <div className="mt-6 rounded-[20px] bg-card p-4 shadow-card">
          <Summary serviceName={service.name} />
        </div>
        <div className="mt-5 space-y-3">
          <Button onClick={() => downloadIcs(booking.reference, service.name, booking.date!, booking.time!, service.minutes)}>Add to Calendar</Button>
          {booking.meetingType === "in-office" && (
            <Button variant="secondary" onClick={() => window.open(firm.mapsUrl, "_blank", "noopener,noreferrer")}>Get Directions</Button>
          )}
          {booking.meetingType === "video" && (
            <Button variant="secondary" onClick={() => pushToast("Join link", "A secure link will be emailed about 15 minutes before the call.")}>Join Link</Button>
          )}
          <Button
            variant="secondary"
            onClick={async () => {
              const text = `${service.name} on ${longDate(booking.date!)} at ${booking.time}. Reference ${booking.reference}.`;
              if (navigator.share) await navigator.share({ title: "Appointment", text });
              else {
                await navigator.clipboard.writeText(text);
                pushToast("Copied", "Appointment details copied.");
              }
            }}
          >
            Share
          </Button>
          <Button variant="ghost" onClick={() => navigate({ to: "/appointments" })}>Go to Appointments</Button>
          <Button variant="ghost" onClick={() => navigate({ to: "/home" })}>Back to Home</Button>
        </div>
      </div>
      </div>
    );
  }

  return (
    <Page title="Book" large={step === 1} back={step > 1} onBack={() => go(step - 1)} right={<span className="pr-2 text-[13px] font-semibold text-muted-foreground">Step {step} of 6</span>}>
      <div className="px-5">
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${(step / 6) * 100}%` }} />
        </div>
        <div className="mb-4 flex gap-1">
          {[1, 2, 3, 4, 5].map((item) => (
            <button
              key={item}
              type="button"
              disabled={item > step}
              aria-label={`Edit step ${item}`}
              onClick={() => item < step && go(item)}
              className={`h-2 flex-1 rounded-full ${item <= step ? "bg-primary" : "bg-divider"}`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="px-5">
          <h2 className="text-[22px] font-semibold">Select a service</h2>
          <div className="mt-3">
            <SearchField value={query} onChange={setQuery} placeholder="Search services" />
          </div>
          <div className="mt-3 space-y-2">
            {bookableServices()
              .filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()))
              .map((item) => {
                const selected = booking.serviceId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setBooking({ serviceId: item.id })}
                    className={`flex min-h-[64px] w-full items-center gap-3 rounded-[16px] border px-4 py-3 text-left ${selected ? "border-primary bg-[color-mix(in_srgb,var(--primary)_8%,white)]" : "border-transparent bg-card shadow-card"}`}
                  >
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${selected ? "border-primary bg-primary text-white" : "border-divider"}`}>
                      {selected && <Check size={14} />}
                    </span>
                    <span className="flex-1">
                      <span className="block text-[17px] font-semibold">{item.name}</span>
                      <span className="text-[13px] text-muted-foreground">{item.minutes} min · {item.category}</span>
                    </span>
                  </button>
                );
              })}
          </div>
          <div className="mt-5">
            <Button onClick={() => go(2)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="px-5">
          <h2 className="text-[22px] font-semibold">How should we meet?</h2>
          <div className="mt-3 space-y-3">
            {meetingOptions.map((option) => {
              const Icon = icons[option.id];
              const selected = booking.meetingType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setBooking({ meetingType: option.id })}
                  className={`w-full rounded-[20px] border p-4 text-left ${selected ? "border-primary bg-[color-mix(in_srgb,var(--primary)_8%,white)]" : "border-transparent bg-card shadow-card"}`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="text-sky" />
                    <span className="text-[17px] font-semibold">{option.title}</span>
                  </span>
                  <span className="mt-2 block text-[15px] leading-relaxed text-muted-foreground">{option.body}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-5">
            <Button onClick={() => go(3)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="px-5">
          <h2 className="text-[22px] font-semibold">Date and time</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">{firm.timezone}</p>
          <div className="mt-3">
            <CalendarPicker value={booking.date} onChange={(date) => setBooking({ date, time: null })} />
          </div>
          {booking.date && (
            <div className="mt-4 space-y-4">
              {slotGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 text-[15px] font-semibold">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.slots.map((slot) => {
                      const open = isSlotOpen(booking.date!, slot);
                      const selected = booking.time === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={!open}
                          aria-pressed={selected}
                          onClick={() => {
                            haptic("light");
                            setBooking({ time: slot });
                          }}
                          className={`min-h-11 rounded-full px-3 text-[15px] font-semibold ${selected ? "bg-primary text-white" : open ? "bg-card text-foreground shadow-card" : "bg-muted text-muted-foreground line-through"}`}
                        >
                          <span className="sr-only">{open ? "" : "Unavailable "}</span>
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
            <Button onClick={() => go(4)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="px-5">
          <h2 className="text-[22px] font-semibold">Your details</h2>
          <div className="mt-4 space-y-4">
            <Field label="Full name" value={booking.name} onChange={(name) => setBooking({ name })} autoComplete="name" />
            <Field label="Email" type="email" inputMode="email" value={booking.email} onChange={(email) => setBooking({ email })} autoComplete="email" />
            <Field label="Phone" inputMode="tel" value={booking.phone} onChange={(phone) => setBooking({ phone: formatPhone(phone) })} autoComplete="tel" />
            <div>
              <p className="mb-2 text-[13px] font-medium text-muted-foreground">Are you a new or returning client?</p>
              <Segmented
                label="Client status"
                value={booking.clientStatus}
                onChange={(clientStatus) => setBooking({ clientStatus })}
                options={[
                  { id: "new", label: "New" },
                  { id: "returning", label: "Returning" },
                ]}
              />
            </div>
            <TextArea label="Tell us briefly what you need help with" value={booking.notes} onChange={(notes) => setBooking({ notes })} placeholder="For example, a first year of S-Corp filings for a cafe." />
            <div>
              <label className="flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-dashed border-primary text-[17px] font-semibold text-primary">
                <Upload size={18} /> Upload documents (optional)
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setBooking({ files: [...booking.files, { id: `f-${Date.now()}`, name: file.name, kind: fileKind(file.name), added: "Today" }] });
                  }}
                />
              </label>
              <ul className="mt-2 space-y-2">
                {booking.files.map((file) => (
                  <li key={file.id} className="flex items-center gap-2 text-[15px]">
                    <FileText size={16} className="text-sky" />
                    <span className="flex-1 truncate">{file.name}</span>
                    <button type="button" className="min-h-11 text-primary" onClick={() => setBooking({ files: booking.files.filter((item) => item.id !== file.id) })}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{privacyNote}</p>
            </div>
            <Button onClick={() => go(5)}>Review Appointment</Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="px-5">
          <h2 className="text-[22px] font-semibold">Review and confirm</h2>
          <div className="mt-3 rounded-[20px] bg-card p-4 shadow-card">
            <ReviewRow label="Service" value={`${service.name} · ${service.minutes} min`} onEdit={() => go(1)} />
            <ReviewRow label="Meeting" value={labelFor(booking.meetingType)} onEdit={() => go(2)} />
            <ReviewRow label="When" value={booking.date && booking.time ? `${longDate(booking.date)} · ${booking.time}` : ""} onEdit={() => go(3)} />
            <ReviewRow label="Where" value={placeFor(booking.meetingType)} onEdit={() => go(2)} />
            <ReviewRow label="Contact" value={`${booking.name}\n${booking.email}\n${booking.phone}`} onEdit={() => go(4)} />
          </div>
          <div className="mt-3 rounded-[16px] bg-card px-4 shadow-card">
            <Toggle checked={booking.reminders} onChange={(reminders) => setBooking({ reminders })} label="Send me reminders" detail="Email and phone notifications about this visit." />
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{cancellationPolicy}</p>
          <div className="mt-5">
            <Button onClick={confirm}>Confirm Appointment</Button>
          </div>
        </div>
      )}
    </Page>
  );
}

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-start gap-3 border-t border-divider py-3 first:border-t-0">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] text-muted-foreground">{label}</p>
        <p className="whitespace-pre-line text-[17px]">{value}</p>
      </div>
      <button type="button" onClick={onEdit} className="min-h-11 text-[15px] font-semibold text-primary">
        Edit
      </button>
    </div>
  );
}

function Summary({ serviceName }: { serviceName: string }) {
  const { booking } = useApp();
  return (
    <div className="space-y-2 text-[15px]">
      <p className="text-[17px] font-semibold">{serviceName}</p>
      <p>{booking.date ? longDate(booking.date) : ""} · {booking.time}</p>
      <p>{labelFor(booking.meetingType)}</p>
      <p className="text-muted-foreground">{placeFor(booking.meetingType)}</p>
    </div>
  );
}

function labelFor(type: MeetingType | null) {
  if (type === "in-office") return "In-Office";
  if (type === "phone") return "Phone Call";
  if (type === "video") return "Video Call";
  return "";
}

function placeFor(type: MeetingType | null) {
  if (type === "in-office") return `${firm.addressLine}, ${firm.cityLine}`;
  if (type === "phone") return "We will call the number you provided.";
  if (type === "video") return "A join link will be emailed before the appointment.";
  return "";
}

function downloadIcs(reference: string, title: string, date: string, time: string, minutes: number) {
  const [hourPart, minutePart, meridiem] = time.replace(" ", ":").split(":");
  // time is like "10:30 AM" — parse manually
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const pm = match[3].toUpperCase() === "PM";
  if (pm && hour < 12) hour += 12;
  if (!pm && hour === 12) hour = 0;
  const stamp = `${date.replace(/-/g, "")}T${String(hour).padStart(2, "0")}${String(minute).padStart(2, "0")}00`;
  const endMinute = minute + minutes;
  const endHour = hour + Math.floor(endMinute / 60);
  const end = `${date.replace(/-/g, "")}T${String(endHour).padStart(2, "0")}${String(endMinute % 60).padStart(2, "0")}00`;
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//KJ Gilbertson CPA//EN\nBEGIN:VEVENT\nUID:${reference}@kjgilbertson.local\nDTSTART:${stamp}\nDTEND:${end}\nSUMMARY:${title}\nLOCATION:${firm.addressLine}, ${firm.cityLine}\nDESCRIPTION:Pacific Time (Las Vegas). Reference ${reference}\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${reference}.ics`;
  link.click();
  URL.revokeObjectURL(url);
  void hourPart;
  void minutePart;
  void meridiem;
}
