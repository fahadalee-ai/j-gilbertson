import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { addDays, format, getDay } from "date-fns";
import { fileKind, isoDate, referenceCode } from "./format";
import type { MeetingType } from "./content";

const KEY = "kjg-cpa-v1";

export type ClientType = "Individual" | "Freelancer" | "Small Business Owner";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  clientType: ClientType;
};

export type ApptStatus = "confirmed" | "pending" | "cancelled" | "completed";

export type Doc = { id: string; name: string; kind: string; added: string; userId?: string };

export type Appointment = {
  id: string;
  userId: string;
  serviceId: string;
  date: string;
  time: string;
  meetingType: MeetingType;
  status: ApptStatus;
  notes: string;
  reference: string;
  reminders: boolean;
  documents: Doc[];
  cancelReason?: string;
  cpa: string;
};

export type Notice = {
  id: string;
  userId: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
};

export type BookingDraft = {
  serviceId: string | null;
  meetingType: MeetingType | null;
  date: string | null;
  time: string | null;
  name: string;
  email: string;
  phone: string;
  clientStatus: "new" | "returning";
  notes: string;
  files: Doc[];
  reminders: boolean;
  step: number;
  reference: string;
};

export type Appearance = "system" | "light" | "dark";

export type Prefs = {
  appointments: boolean;
  reminders: boolean;
  deadlines: boolean;
  email: boolean;
  push: boolean;
};

type Persisted = {
  onboarded: boolean;
  userId: string | null;
  guest: boolean;
  users: User[];
  remember: boolean;
  faceId: boolean;
  appearance: Appearance;
  prefs: Prefs;
  appointments: Appointment[];
  documents: Doc[];
  notices: Notice[];
  reminders: { userId: string; dateId: string }[];
  booking: BookingDraft;
  intent: "confirm-booking" | null;
  pendingUserId: string | null;
};

export type Toast = { id: number; title: string; body?: string };

const alex: User = {
  id: "u-alex",
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@email.com",
  phone: "(702) 555-0148",
  password: "Welcome123",
  clientType: "Small Business Owner",
};

function businessDay(from: Date, delta: number) {
  const date = addDays(from, delta);
  const day = getDay(date);
  if (day === 6) return addDays(date, delta >= 0 ? 2 : -1);
  if (day === 0) return addDays(date, delta >= 0 ? 1 : -2);
  return date;
}

function seedAppointments(now: Date): Appointment[] {
  const upcoming = businessDay(now, 4);
  const completed = businessDay(now, -16);
  const cancelled = businessDay(now, -9);
  return [
    {
      id: "apt-upcoming",
      userId: alex.id,
      serviceId: "business-tax",
      date: isoDate(upcoming),
      time: "10:30 AM",
      meetingType: "in-office",
      status: "confirmed",
      notes: "Review the cafe's year-end profit and the owner's draw before filing.",
      reference: "KJG-48291",
      reminders: true,
      documents: [{ id: "d1", name: "2025 profit and loss.pdf", kind: "PDF", added: isoDate(addDays(now, -2)) }],
      cpa: "KJ Gilbertson, CPA",
    },
    {
      id: "apt-done",
      userId: alex.id,
      serviceId: "individual-tax",
      date: isoDate(completed),
      time: "2:00 PM",
      meetingType: "phone",
      status: "completed",
      notes: "Personal return walkthrough.",
      reference: "KJG-22610",
      reminders: true,
      documents: [],
      cpa: "KJ Gilbertson, CPA",
    },
    {
      id: "apt-cancel",
      userId: alex.id,
      serviceId: "bookkeeping",
      date: isoDate(cancelled),
      time: "11:30 AM",
      meetingType: "video",
      status: "cancelled",
      notes: "",
      reference: "KJG-19044",
      reminders: false,
      documents: [],
      cancelReason: "Schedule conflict",
      cpa: "KJ Gilbertson, CPA",
    },
  ];
}

function seedNotices(now: Date): Notice[] {
  return [
    {
      id: "n1",
      userId: alex.id,
      title: "Appointment confirmed",
      body: "Business Tax Preparation is on the calendar. We will see you in the office.",
      at: format(addDays(now, -1), "MMM d"),
      read: false,
    },
    {
      id: "n2",
      userId: alex.id,
      title: "Reminder, 24 hours before",
      body: "We will remind you the day before your visit, by email and on this phone if you allow notifications.",
      at: format(now, "MMM d"),
      read: false,
    },
    {
      id: "n3",
      userId: alex.id,
      title: "A tax date you can save",
      body: "Upcoming federal dates are listed on Home. They are informational, and you can tap Remind Me.",
      at: format(addDays(now, -3), "MMM d"),
      read: true,
    },
  ];
}

export function emptyBooking(): BookingDraft {
  return {
    serviceId: null,
    meetingType: null,
    date: null,
    time: null,
    name: "",
    email: "",
    phone: "",
    clientStatus: "new",
    notes: "",
    files: [],
    reminders: true,
    step: 1,
    reference: "",
  };
}

function initialPersisted(): Persisted {
  const now = new Date();
  return {
    onboarded: false,
    userId: null,
    guest: false,
    users: [alex],
    remember: true,
    faceId: false,
    appearance: "system",
    prefs: { appointments: true, reminders: true, deadlines: true, email: true, push: true },
    appointments: seedAppointments(now),
    documents: [
      { id: "doc-organizer", userId: alex.id, name: "2025 organizer notes.pdf", kind: "PDF", added: isoDate(addDays(now, -12)) },
      { id: "doc-receipt", userId: alex.id, name: "Equipment receipt.jpg", kind: "Image", added: isoDate(addDays(now, -4)) },
    ],
    notices: seedNotices(now),
    reminders: [],
    booking: emptyBooking(),
    intent: null,
    pendingUserId: null,
  };
}

type Store = Persisted & {
  ready: boolean;
  user: User | null;
  toasts: Toast[];
  markOnboarded: () => void;
  continueAsGuest: () => void;
  login: (email: string, password: string) => string | null;
  loginAsAlex: () => void;
  register: (input: Omit<User, "id">) => string | null;
  completeVerification: () => boolean;
  logout: () => void;
  deleteAccount: () => void;
  updateUser: (patch: Partial<User>) => void;
  setRemember: (value: boolean) => void;
  setFaceId: (value: boolean) => void;
  setAppearance: (value: Appearance) => void;
  setPrefs: (patch: Partial<Prefs>) => void;
  setBooking: (patch: Partial<BookingDraft>) => void;
  resetBooking: () => void;
  beginBooking: (serviceId?: string) => void;
  setIntent: (intent: Persisted["intent"]) => void;
  confirmBooking: () => Appointment | null;
  reschedule: (id: string, date: string, time: string) => void;
  cancelAppointment: (id: string, reason: string) => void;
  addDocument: (name: string) => void;
  removeDocument: (id: string) => void;
  toggleReminder: (dateId: string) => void;
  markNoticeRead: (id: string) => void;
  markAllNoticesRead: () => void;
  pushToast: (title: string, body?: string) => void;
  dismissToast: (id: number) => void;
};

const Ctx = createContext<Store | null>(null);

function applyTheme(appearance: Appearance) {
  if (typeof document === "undefined") return;
  const dark =
    appearance === "dark" ||
    (appearance === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.classList.toggle("light", appearance === "light");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#0E0E14" : "#F7F8FC");
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Persisted>(initialPersisted);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Persisted>;
        setData((current) => ({
          ...current,
          ...saved,
          users: saved.users?.length ? saved.users : current.users,
          prefs: { ...current.prefs, ...saved.prefs },
          booking: { ...current.booking, ...saved.booking },
        }));
      }
    } catch {
      /* Ignore a damaged saved session and keep the sample data. */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(data));
    applyTheme(data.appearance);
  }, [data, ready]);

  useEffect(() => {
    if (data.appearance !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [data.appearance]);

  const user = data.users.find((item) => item.id === data.userId) ?? null;

  const api = useMemo<Store>(() => {
    const patch = (partial: Partial<Persisted>) => setData((current) => ({ ...current, ...partial }));
    const pushToast = (title: string, body?: string) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { id, title, body }]);
      window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3200);
    };

    return {
      ...data,
      ready,
      user,
      toasts,
      markOnboarded: () => patch({ onboarded: true }),
      continueAsGuest: () => patch({ guest: true, userId: null, onboarded: true }),
      login: (email, password) => {
        const found = data.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
        if (!found) return "We couldn't find an account with that email.";
        if (found.password !== password) return "That password doesn't match our records.";
        patch({
          userId: found.id,
          guest: false,
          onboarded: true,
          booking: {
            ...data.booking,
            name: data.booking.name || `${found.firstName} ${found.lastName}`,
            email: data.booking.email || found.email,
            phone: data.booking.phone || found.phone,
          },
        });
        return null;
      },
      loginAsAlex: () => {
        patch({
          userId: alex.id,
          guest: false,
          onboarded: true,
          booking: {
            ...data.booking,
            name: data.booking.name || `${alex.firstName} ${alex.lastName}`,
            email: data.booking.email || alex.email,
            phone: data.booking.phone || alex.phone,
          },
        });
      },
      register: (input) => {
        if (data.users.some((item) => item.email.toLowerCase() === input.email.toLowerCase())) {
          return "An account with that email already exists. Try logging in.";
        }
        const next: User = { ...input, id: `u-${Date.now()}` };
        patch({ users: [...data.users, next], pendingUserId: next.id });
        return null;
      },
      completeVerification: () => {
        const pending = data.users.find((item) => item.id === data.pendingUserId);
        if (!pending) return false;
        patch({
          userId: pending.id,
          pendingUserId: null,
          guest: false,
          onboarded: true,
          notices: [
            {
              id: `n-${Date.now()}`,
              userId: pending.id,
              title: "Welcome to KJ Gilbertson CPA",
              body: "Your phone is verified. You can book a visit whenever you are ready.",
              at: "Just now",
              read: false,
            },
            ...data.notices,
          ],
          booking: {
            ...data.booking,
            name: data.booking.name || `${pending.firstName} ${pending.lastName}`,
            email: data.booking.email || pending.email,
            phone: data.booking.phone || pending.phone,
          },
        });
        return true;
      },
      logout: () => patch({ userId: null, guest: false, booking: emptyBooking(), intent: null }),
      deleteAccount: () => {
        if (!user) return;
        patch({
          users: data.users.filter((item) => item.id !== user.id),
          appointments: data.appointments.filter((item) => item.userId !== user.id),
          documents: [],
          notices: data.notices.filter((item) => item.userId !== user.id),
          reminders: data.reminders.filter((item) => item.userId !== user.id),
          userId: null,
          guest: false,
          booking: emptyBooking(),
        });
      },
      updateUser: (partial) => {
        if (!user) return;
        patch({ users: data.users.map((item) => (item.id === user.id ? { ...item, ...partial } : item)) });
      },
      setRemember: (remember) => patch({ remember }),
      setFaceId: (faceId) => patch({ faceId }),
      setAppearance: (appearance) => patch({ appearance }),
      setPrefs: (partial) => patch({ prefs: { ...data.prefs, ...partial } }),
      setBooking: (partial) => patch({ booking: { ...data.booking, ...partial } }),
      resetBooking: () => patch({ booking: emptyBooking(), intent: null }),
      beginBooking: (serviceId) => {
        const prefill = user
          ? {
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              phone: user.phone,
              clientStatus: "returning" as const,
            }
          : { name: data.booking.name, email: data.booking.email, phone: data.booking.phone };
        patch({
          booking: {
            ...emptyBooking(),
            ...prefill,
            serviceId: serviceId ?? null,
            step: serviceId ? 2 : 1,
            reminders: data.prefs.reminders,
          },
        });
      },
      setIntent: (intent) => patch({ intent }),
      confirmBooking: () => {
        const active = user ?? data.users.find((item) => item.id === alex.id);
        if (!active) return null;
        const serviceId = data.booking.serviceId ?? "consultation";
        const meetingType = data.booking.meetingType ?? "in-office";
        const date = data.booking.date ?? isoDate(businessDay(new Date(), 1));
        const time = data.booking.time ?? "10:30 AM";
        const appointment: Appointment = {
          id: `apt-${Date.now()}`,
          userId: active.id,
          serviceId,
          date,
          time,
          meetingType,
          status: "confirmed",
          notes: data.booking.notes,
          reference: referenceCode(),
          reminders: data.booking.reminders,
          documents: data.booking.files,
          cpa: "KJ Gilbertson, CPA",
        };
        const notice: Notice = {
          id: `n-${Date.now()}`,
          userId: active.id,
          title: "Appointment confirmed",
          body: `Your visit is booked. Reference ${appointment.reference}.`,
          at: "Just now",
          read: false,
        };
        patch({
          userId: active.id,
          guest: false,
          appointments: [appointment, ...data.appointments],
          booking: { ...data.booking, serviceId, meetingType, date, time, step: 6, reference: appointment.reference },
          notices: [notice, ...data.notices],
          intent: null,
        });
        return appointment;
      },
      reschedule: (id, date, time) => {
        patch({
          appointments: data.appointments.map((item) =>
            item.id === id ? { ...item, date, time, status: "confirmed" } : item,
          ),
        });
      },
      cancelAppointment: (id, reason) => {
        patch({
          appointments: data.appointments.map((item) =>
            item.id === id ? { ...item, status: "cancelled", cancelReason: reason } : item,
          ),
        });
      },
      addDocument: (name) => {
        const doc = { id: `doc-${Date.now()}`, userId: user?.id, name, kind: fileKind(name), added: isoDate(new Date()) };
        patch({ documents: [doc, ...data.documents] });
      },
      removeDocument: (id) => patch({ documents: data.documents.filter((item) => item.id !== id) }),
      toggleReminder: (dateId) => {
        if (!user) return;
        const exists = data.reminders.some((item) => item.userId === user.id && item.dateId === dateId);
        patch({
          reminders: exists
            ? data.reminders.filter((item) => !(item.userId === user.id && item.dateId === dateId))
            : [...data.reminders, { userId: user.id, dateId }],
        });
      },
      markNoticeRead: (id) =>
        patch({ notices: data.notices.map((item) => (item.id === id ? { ...item, read: true } : item)) }),
      markAllNoticesRead: () =>
        patch({ notices: data.notices.map((item) => (user && item.userId === user.id ? { ...item, read: true } : item)) }),
      pushToast,
      dismissToast: (id) => setToasts((current) => current.filter((toast) => toast.id !== id)),
    };
  }, [data, ready, toasts, user]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useApp() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}

export const DEMO = { email: alex.email, password: alex.password };
