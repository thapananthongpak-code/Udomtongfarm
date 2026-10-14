// Telling the staff that an order has arrived: a short chime, a notification on the device, and
// a count in the browser tab's title. All of it only works while the order page is open.

const SOUND_KEY = "order-sound";

let context: AudioContext | null = null;

/** Browsers only allow sound after the person has clicked something, so this is called from a click. */
export function unlockSound() {
  try {
    context ??= new AudioContext();
    void context.resume();
  } catch {
    // No sound support: the visual alert still works.
  }
}

/** A friendly two-note chime. */
export function chime() {
  if (!context || context.state !== "running") return;
  const now = context.currentTime;
  [
    { frequency: 880, start: 0 },
    { frequency: 1174.66, start: 0.18 },
  ].forEach(({ frequency, start }) => {
    const oscillator = context!.createOscillator();
    const gain = context!.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(0.4, now + start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + 0.5);
    oscillator.connect(gain).connect(context!.destination);
    oscillator.start(now + start);
    oscillator.stop(now + start + 0.55);
  });
}

export const soundWanted = (): boolean => {
  try {
    return window.localStorage.getItem(SOUND_KEY) !== "0";
  } catch {
    return true;
  }
};

export function rememberSound(on: boolean) {
  try {
    window.localStorage.setItem(SOUND_KEY, on ? "1" : "0");
  } catch {
    // The choice still applies until the page is closed.
  }
}

export const notificationsAvailable = () => typeof Notification !== "undefined";

export async function askForNotifications(): Promise<boolean> {
  if (!notificationsAvailable()) return false;
  if (Notification.permission === "granted") return true;
  return (await Notification.requestPermission()) === "granted";
}

export function notify(title: string, body: string) {
  if (!notificationsAvailable() || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, tag: "new-order", requireInteraction: false });
  } catch {
    // Some browsers only allow notifications from a service worker: nothing more to do.
  }
}
