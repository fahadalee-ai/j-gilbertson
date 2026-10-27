import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  FileText,
  HelpCircle,
  Info,
  LogOut,
  MapPin,
  Moon,
  Settings,
  Shield,
  Star,
  Upload,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Accordion, Button, Field, Group, Page, Photo, Row, SearchField, Segmented, Toggle } from "@/components/mobile";
import { useOverlay } from "@/components/mobile";
import { faqs, firm, privacyNote, taxDates, team, testimonials, values } from "@/lib/content";
import { formatPhone, isEmail, isPhone, longDate } from "@/lib/format";
import { useApp, type Appearance } from "@/lib/store";
import { LegalBody } from "./AuthScreens";

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user, guest, logout, pushToast } = useApp();
  const { openAlert, openSheet, closeSheet } = useOverlay();
  const name = user ? `${user.firstName} ${user.lastName}` : guest ? "Guest" : "Welcome";
  const email = user?.email ?? "Sign in to save appointments";

  return (
    <Page title="Profile" large>
      <div className="mx-5 flex items-center gap-4 rounded-[20px] bg-card p-4 shadow-card">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#4C419A,#2EB4E8)] text-[22px] font-bold text-white">
          {user ? `${user.firstName[0]}${user.lastName[0]}` : "G"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[20px] font-semibold">{name}</p>
          <p className="truncate text-[13px] text-muted-foreground">{email}</p>
          <button type="button" className="mt-1 min-h-11 text-[15px] font-semibold text-primary" onClick={() => (user ? navigate({ to: "/profile/edit" }) : navigate({ to: "/login" }))}>
            {user ? "Edit Profile" : "Log In"}
          </button>
        </div>
      </div>

      <Group label="Your file">
        <Row icon={<FileText size={18} />} title="My Documents" onClick={() => navigate({ to: "/profile/documents" })} />
        <Row icon={<Bell size={18} />} title="Notifications" onClick={() => navigate({ to: "/notifications" })} />
        <Row icon={<Star size={18} />} title="Saved Reminders" onClick={() => navigate({ to: "/profile/reminders" })} />
      </Group>
      <Group label="The firm">
        <Row icon={<Info size={18} />} title="About the Firm" onClick={() => navigate({ to: "/profile/about" })} />
        <Row icon={<MapPin size={18} />} title="Contact and Location" onClick={() => navigate({ to: "/profile/contact" })} />
        <Row icon={<HelpCircle size={18} />} title="FAQs" onClick={() => navigate({ to: "/profile/faqs" })} />
      </Group>
      <Group label="App">
        <Row icon={<Settings size={18} />} title="Settings" onClick={() => navigate({ to: "/profile/settings" })} />
        <Row icon={<Shield size={18} />} title="Privacy Policy" onClick={() => navigate({ to: "/profile/privacy" })} />
        <Row icon={<FileText size={18} />} title="Terms of Service" onClick={() => navigate({ to: "/profile/terms" })} />
        <Row
          icon={<Star size={18} />}
          title="Rate the App"
          onClick={() =>
            openSheet({
              title: "Rate the App",
              content: (
                <RateForm
                  onSubmit={() => {
                    closeSheet();
                    pushToast("Thanks for the feedback");
                  }}
                />
              ),
            })
          }
        />
      </Group>
      {user && (
        <Group>
          <Row
            icon={<LogOut size={18} />}
            title="Log Out"
            destructive
            chevron={false}
            onClick={() =>
              openAlert({
                title: "Log out?",
                message: "You can sign back in any time. Saved appointments stay on this device.",
                actions: [
                  { label: "Cancel", role: "cancel" },
                  { label: "Log Out", role: "destructive", onPress: () => { logout(); navigate({ to: "/welcome" }); } },
                ],
              })
            }
          />
        </Group>
      )}
      <p className="mt-6 px-8 text-[13px] leading-relaxed text-muted-foreground">{privacyNote}</p>
    </Page>
  );
}

export function EditProfileScreen() {
  const { user, updateUser, pushToast } = useApp();
  const navigate = useNavigate();
  const [first, setFirst] = useState(user?.firstName ?? "");
  const [last, setLast] = useState(user?.lastName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [error, setError] = useState("");

  if (!user) {
    return (
      <Page title="Edit Profile" back>
        <div className="px-5">
          <Button onClick={() => navigate({ to: "/login" })}>Log In</Button>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Edit Profile" back>
      <div className="space-y-4 px-5">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-[28px] font-bold text-white">
          {first[0] ?? "A"}
          {last[0] ?? ""}
        </div>
        <label className="mx-auto block w-fit min-h-11 cursor-pointer text-[15px] font-semibold text-primary">
          Change photo
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={() => pushToast("Photo updated", "In this preview the initials stay on your profile.")}
          />
        </label>
        <Field label="First name" value={first} onChange={setFirst} />
        <Field label="Last name" value={last} onChange={setLast} />
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Phone" inputMode="tel" value={phone} onChange={(value) => setPhone(formatPhone(value))} />
        {error && <p className="text-[13px] text-destructive">{error}</p>}
        <Button
          onClick={() => {
            if (first.trim().length < 2 || last.trim().length < 2) return setError("Enter your first and last name.");
            if (!isEmail(email)) return setError("Enter a valid email.");
            if (!isPhone(phone)) return setError("Enter a 10-digit phone number.");
            updateUser({ firstName: first.trim(), lastName: last.trim(), email: email.trim(), phone: formatPhone(phone) });
            pushToast("Profile saved");
            window.history.back();
          }}
        >
          Save
        </Button>
      </div>
    </Page>
  );
}

export function NotificationsScreen() {
  const { user, notices, prefs, setPrefs, markNoticeRead, markAllNoticesRead } = useApp();
  const { ask } = useOverlay();
  const mine = notices.filter((item) => item.userId === user?.id);

  return (
    <Page title="Notifications" back>
      <div className="px-5">
        {user && mine.some((item) => !item.read) && (
          <button type="button" className="mb-3 min-h-11 text-[15px] font-semibold text-primary" onClick={markAllNoticesRead}>
            Mark all read
          </button>
        )}
        {!user && <p className="text-[15px] text-muted-foreground">Log in to see appointment updates. You can still set preferences on this device.</p>}
        <div className="space-y-2">
          {mine.map((item) => (
            <button key={item.id} type="button" onClick={() => markNoticeRead(item.id)} className="w-full rounded-[16px] bg-card p-4 text-left shadow-card">
              <span className="flex items-center justify-between gap-2">
                <span className="text-[17px] font-semibold">{item.title}</span>
                {!item.read && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
              </span>
              <span className="mt-1 block text-[15px] leading-relaxed text-muted-foreground">{item.body}</span>
              <span className="mt-1 block text-[13px] text-muted-foreground">{item.at}{item.read ? " · Read" : " · New"}</span>
            </button>
          ))}
        </div>
      </div>
      <Group label="Preferences">
        <div className="px-4">
          <Toggle label="Appointment confirmations" checked={prefs.appointments} onChange={(appointments) => setPrefs({ appointments })} />
          <Toggle label="Reminder 24 hours before" checked={prefs.reminders} onChange={async (reminders) => {
            if (reminders) {
              const allowed = await ask("Notifications", "Allow reminders the day before an appointment?");
              if (!allowed) return;
            }
            setPrefs({ reminders });
          }} />
          <Toggle label="Deadline reminders" checked={prefs.deadlines} onChange={(deadlines) => setPrefs({ deadlines })} />
          <Toggle label="Email" checked={prefs.email} onChange={(email) => setPrefs({ email })} />
          <Toggle label="Push notifications" checked={prefs.push} onChange={async (push) => {
            if (push) {
              const allowed = await ask("Notifications", "KJ Gilbertson CPA would like to send you notifications.");
              if (!allowed) return;
            }
            setPrefs({ push });
          }} />
        </div>
      </Group>
    </Page>
  );
}

export function DocumentsScreen() {
  const { documents, addDocument, removeDocument, user } = useApp();
  const navigate = useNavigate();
  return (
    <Page title="My Documents" back>
      <div className="px-5">
        {!user && <Button onClick={() => navigate({ to: "/login" })}>Log In to upload</Button>}
        {user && (
          <label className="mb-4 flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-primary text-[17px] font-semibold text-white">
            <Upload size={18} /> Upload
            <input type="file" accept="application/pdf,image/*" className="sr-only" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) addDocument(file.name);
            }} />
          </label>
        )}
        <div className="overflow-hidden rounded-[16px] bg-card shadow-card">
          {documents.length === 0 && <p className="p-4 text-[15px] text-muted-foreground">No documents yet.</p>}
          {documents.map((doc) => (
            <div key={doc.id} className="flex min-h-[52px] items-center gap-3 border-t border-divider px-4 first:border-t-0">
              <FileText className="text-sky" size={18} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px]">{doc.name}</span>
                <span className="text-[13px] text-muted-foreground">{doc.kind} · {doc.added}</span>
              </span>
              <button type="button" className="min-h-11 text-[15px] font-semibold text-destructive" onClick={() => removeDocument(doc.id)}>Remove</button>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">Your documents are kept confidential and are visible only to you and your CPA. This preview stores file names on this device.</p>
      </div>
    </Page>
  );
}

export function RemindersScreen() {
  const { user, reminders } = useApp();
  const saved = taxDates.filter((item) => reminders.some((reminder) => reminder.userId === user?.id && reminder.dateId === item.id));
  return (
    <Page title="Saved Reminders" back>
      <div className="space-y-3 px-5">
        {saved.length === 0 && <p className="text-[17px] leading-relaxed text-muted-foreground">Tax dates you tap Remind Me on will be listed here. They are informational.</p>}
        {saved.map((item) => (
          <div key={item.id} className="rounded-[16px] bg-card p-4 shadow-card">
            <p className="text-[17px] font-semibold">{item.label}</p>
            <p className="text-[15px] text-muted-foreground">{longDate(item.date)}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{item.detail}</p>
          </div>
        ))}
      </div>
    </Page>
  );
}

export function AboutScreen() {
  const navigate = useNavigate();
  const { beginBooking } = useApp();
  return (
    <Page title="About the Firm" back>
      <div className="px-5">
        <Photo src="office-hero.jpg" alt="The KJ Gilbertson CPA team in a bright Las Vegas office" className="h-48 w-full rounded-[20px]" />
        <h2 className="mt-5 text-[22px] font-semibold">A local firm for small businesses</h2>
        <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">
          KJ Gilbertson CPA LLC works with individuals, freelancers, and small businesses across Las Vegas. Cafes, contractors, shops, and professional practices come here when they want a real person, not a call center.
        </p>
        <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">
          You get a licensed CPA, plain-language answers, and a booking process that respects your time. We do not promise a refund or a savings number. We do promise a clear next step.
        </p>
        <h2 className="mt-6 text-[22px] font-semibold">Mission</h2>
        <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">Help Las Vegas owners stay organized, file on time, and make decisions with a clear picture of their numbers.</p>
        <h2 className="mt-6 text-[22px] font-semibold">Values</h2>
        <div className="mt-3 space-y-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-[16px] bg-card p-4 shadow-card">
              <p className="text-[17px] font-semibold">{value.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{value.body}</p>
            </div>
          ))}
        </div>
        <h2 className="mt-6 text-[22px] font-semibold">Meet the Team</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">Sample profiles the firm can edit.</p>
        <div className="mt-3 space-y-3">
          {team.map((person) => (
            <div key={person.id} className="flex gap-3 rounded-[20px] bg-card p-3 shadow-card">
              <Photo src={person.image} alt={`Portrait of ${person.name}`} className="h-24 w-24 rounded-[16px]" />
              <div>
                <p className="text-[17px] font-semibold">{person.name}</p>
                <p className="text-[13px] text-sky">{person.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{person.bio}</p>
              </div>
            </div>
          ))}
        </div>
        <h2 className="mt-6 text-[22px] font-semibold">Credentials</h2>
        <ul className="mt-2 space-y-2 text-[17px] leading-relaxed text-muted-foreground">
          <li>Certified Public Accountant leading the practice.</li>
          <li>Nevada CPA license number is available from the firm on request. It is not printed in this preview.</li>
          <li>Serving individuals and small businesses in Las Vegas and greater Nevada.</li>
        </ul>
        <div className="mt-6">
          <Button onClick={() => { beginBooking("consultation"); navigate({ to: "/book" }); }}>Book a Consultation</Button>
        </div>
        <p className="mt-4 text-[12px] text-muted-foreground">Sample review portraits are also used on Home. {testimonials.length} comments are marked as samples.</p>
      </div>
    </Page>
  );
}

export function ContactScreen() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const { pushToast } = useApp();

  return (
    <Page title="Contact and Location" back>
      <div className="px-5">
        <iframe title="Map of the office" className="h-44 w-full rounded-[16px] border-0" src="https://www.openstreetmap.org/export/embed.html?bbox=-115.132%2C36.026%2C-115.108%2C36.042&layer=mapnik&marker=36.034013%2C-115.120082" />
        <div className="mt-4 overflow-hidden rounded-[16px] bg-card shadow-card">
          <a href={firm.mapsUrl} className="flex min-h-[52px] items-center gap-3 border-b border-divider px-4">
            <MapPin className="text-sky" size={18} />
            <span>
              <span className="block text-[17px]">{firm.addressLine}</span>
              <span className="text-[13px] text-muted-foreground">{firm.cityLine}</span>
            </span>
          </a>
          <a href={`tel:${firm.phoneTel}`} className="flex min-h-[52px] items-center gap-3 border-b border-divider px-4 text-[17px]">
            <Building2 className="text-sky" size={18} /> {firm.phoneDisplay}
          </a>
          <p className="px-4 py-3 text-[15px] leading-relaxed text-muted-foreground">
            Email: {firm.email}
            <span className="mt-1 block text-[13px]">Sample address. Confirm with the firm before publishing.</span>
          </p>
        </div>
        <h2 className="mt-6 text-[20px] font-semibold">Office hours</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">{firm.hoursNote}</p>
        <div className="mt-2 overflow-hidden rounded-[16px] bg-card shadow-card">
          {firm.hours.map((row) => (
            <div key={row.days} className="flex min-h-11 items-center justify-between border-t border-divider px-4 text-[15px] first:border-t-0">
              <span>{row.days}</span>
              <span className="text-muted-foreground">{row.hours}</span>
            </div>
          ))}
        </div>
        <h2 className="mt-6 text-[20px] font-semibold">Parking and access</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{firm.parking}</p>
        <div className="mt-4">
          <Button onClick={() => window.open(firm.mapsUrl, "_blank", "noopener,noreferrer")}>Get Directions</Button>
        </div>
        <h2 className="mt-8 text-[20px] font-semibold">Send us a message</h2>
        {sent ? (
          <p className="mt-3 text-[17px]">Message received. We will reply during office hours.</p>
        ) : (
          <div className="mt-3 space-y-3">
            <Field label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
            <Field label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
            <Field label="Message" value={form.message} onChange={(message) => setForm({ ...form, message })} />
            {error && <p className="text-[13px] text-destructive">{error}</p>}
            <Button
              onClick={() => {
                if (!navigator.onLine) {
                  setError("You're offline. Try again when you reconnect.");
                  return;
                }
                if (form.name.trim().length < 2 || !isEmail(form.email) || form.message.trim().length < 8) {
                  setError("Add your name, a valid email, and a short message.");
                  return;
                }
                setSent(true);
                pushToast("Message sent", "We will reply during office hours.");
              }}
            >
              Send Message
            </Button>
          </div>
        )}
      </div>
    </Page>
  );
}

export function FaqsScreen() {
  const [query, setQuery] = useState("");
  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return faqs
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => !needle || `${item.q} ${item.a}`.toLowerCase().includes(needle)),
      }))
      .filter((group) => group.items.length);
  }, [query]);

  return (
    <Page title="FAQs" back>
      <div className="px-5">
        <SearchField value={query} onChange={setQuery} placeholder="Search questions" />
      </div>
      {groups.length === 0 && <p className="mt-4 px-5 text-[15px] text-muted-foreground">No questions match that search.</p>}
      {groups.map((group) => (
        <section key={group.id} className="mt-5">
          <h2 className="px-5 text-[20px] font-semibold">{group.title}</h2>
          <div className="mx-5 mt-2 overflow-hidden rounded-[16px] bg-card shadow-card">
            {group.items.map((item) => (
              <Accordion key={item.q} title={item.q}>{item.a}</Accordion>
            ))}
          </div>
        </section>
      ))}
    </Page>
  );
}

export function SettingsScreen() {
  const { appearance, setAppearance, faceId, setFaceId, prefs, setPrefs, deleteAccount, user } = useApp();
  const { ask, openAlert, openSheet, closeSheet } = useOverlay();
  const navigate = useNavigate();

  return (
    <Page title="Settings" back>
      <Group label="Security">
        <div className="px-4">
          <Toggle
            label="Face ID"
            detail="Unlock the app on this iPhone."
            checked={faceId}
            onChange={async (value) => {
              if (value) {
                const allowed = await ask("Face ID", "Allow KJ Gilbertson CPA to use Face ID?");
                if (!allowed) return;
              }
              setFaceId(value);
            }}
          />
        </div>
      </Group>
      <Group label="Notifications">
        <div className="px-4">
          <Toggle label="Appointment alerts" checked={prefs.appointments} onChange={(appointments) => setPrefs({ appointments })} />
          <Toggle label="Reminders" checked={prefs.reminders} onChange={(reminders) => setPrefs({ reminders })} />
        </div>
      </Group>
      <Group label="General">
        <Row icon={<UserRound size={18} />} title="Language" value="English" onClick={() => openSheet({ title: "Language", content: <p className="pb-4 text-[17px] leading-relaxed text-muted-foreground">English is the language for this version. More languages may be added later.</p> })} />
        <div className="border-t border-divider px-4 py-3">
          <p className="mb-2 flex items-center gap-2 text-[17px]"><Moon size={18} className="text-sky" /> Appearance</p>
          <Segmented<Appearance>
            label="Appearance"
            value={appearance}
            onChange={setAppearance}
            options={[
              { id: "system", label: "System" },
              { id: "light", label: "Light" },
              { id: "dark", label: "Dark" },
            ]}
          />
        </div>
      </Group>
      {user && (
        <div className="mt-6 px-5">
          <Button
            variant="destructive"
            onClick={() =>
              openAlert({
                title: "Delete account?",
                message: "This removes the profile stored on this device, including saved appointments in the preview.",
                actions: [
                  { label: "Cancel", role: "cancel" },
                  {
                    label: "Delete Account",
                    role: "destructive",
                    onPress: () => {
                      deleteAccount();
                      closeSheet();
                      navigate({ to: "/welcome" });
                    },
                  },
                ],
              })
            }
          >
            Delete Account
          </Button>
        </div>
      )}
    </Page>
  );
}

export function LegalScreen({ kind }: { kind: "privacy" | "terms" }) {
  return (
    <Page title={kind === "privacy" ? "Privacy Policy" : "Terms of Service"} back>
      <LegalBody kind={kind} />
    </Page>
  );
}

function RateForm({ onSubmit }: { onSubmit: () => void }) {
  const [stars, setStars] = useState(0);
  return (
    <div>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" aria-label={`${value} stars`} className="flex h-11 w-11 items-center justify-center text-[28px] text-[#E0A100]" onClick={() => setStars(value)}>
            {value <= stars ? "★" : "☆"}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <Button onClick={onSubmit} disabled={stars === 0}>Submit</Button>
      </div>
    </div>
  );
}
