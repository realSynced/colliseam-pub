import { NotificationSound } from "./sounds";
import { toast } from "sonner";

class NotificationHandler {
  private static instance: NotificationHandler; // @ts-expect-error
  private audio: HTMLAudioElement;
  private subscribers: Set<(notification: any) => void>;

  private constructor() {
    if (typeof window !== "undefined") {
      this.audio = new Audio(NotificationSound);
    }
    this.subscribers = new Set();
  }

  public static getInstance(): NotificationHandler {
    if (!NotificationHandler.instance) {
      NotificationHandler.instance = new NotificationHandler();
    }
    return NotificationHandler.instance;
  }

  public playSound() {
    if (this.audio) {
      // Reset the audio to the beginning if it's already playing
      this.audio.currentTime = 0;
      this.audio.play().catch(console.error);
    }
  }

  public subscribe(callback: (notification: any) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  public notify(notification: any, title?: string, content?: string) {
    // Play sound
    this.playSound();
    console.log("Notification:", notification, title, content);
    // Show toast
    toast.message(`${title}`, {
      description: `${content}`,
      duration: 8000,
      position: "top-right",
    });
    // toast.custom(
    //   (t) => (
    //     <div className="w-full rounded-lg border border-blackLighter bg-black p-4 text-white shadow-lg">
    //       <h1 className="font-bold">{title}</h1>
    //       <p className="">{content}</p>
    //       <button onClick={() => toast.dismiss(t)}>Dismiss</button>
    //     </div>
    //   ),
    //   {
    //     duration: 8000,
    //     position: "top-right",
    //   },
    // );

    // Notify all subscribers
    this.subscribers.forEach((callback) => callback(notification));
  }
}

export const notificationHandler = NotificationHandler.getInstance();
