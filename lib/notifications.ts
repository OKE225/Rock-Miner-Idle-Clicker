import * as Notifications from "expo-notifications";

type GameNotification = {
  title: string;
  body: string;
};

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

const OFTEN_NOTIFICATIONS: GameNotification[] = [
  {
    title: "Combo Time",
    body: "Come back and continue your mining combo",
  },
  {
    title: "Keep Digging",
    body: "Your progress is waiting - keep mining!",
  },
  {
    title: "The Rocks Miss You",
    body: "Your pickaxe is ready. Come back and mine!",
  },
  {
    title: "Idle Income",
    body: "Coins are waiting in your mine!",
  },
  {
    title: "Upgrade Available",
    body: "You can afford a new upgrade!",
  },
  {
    title: "Stronger Pickaxe",
    body: "A new upgrade is within reach. Check the shop!",
  },
  {
    title: "Power Reset",
    body: "Rebirth now and grow faster than before!",
  },
];

const SOMETIMES_NOTIFICATIONS: GameNotification[] = [
  {
    title: "We Miss You",
    body: "Your mine has been waiting for you!",
  },
  {
    title: "New Beginning",
    body: "Rebirth to unlock powerful skill upgrades!",
  },
  {
    title: "Reset and Grow",
    body: "Rebirth to become even stronger!",
  },
  {
    title: "Rebirth Bonus",
    body: "A rebirth can multiply your progress!",
  },
  {
    title: "Chest Ready",
    body: "A chest is waiting for you in the mine!",
  },
  {
    title: "Premium Deal",
    body: "Check the Diamond Store for special offers!",
  },
  {
    title: "Beat Your Best",
    body: "Your deepest point record is waiting to be broken!",
  },
];

const RARELY_NOTIFICATIONS: GameNotification[] = [
  {
    title: "Your Streak Is Waiting",
    body: "Come back today to keep your progress alive!",
  },
  {
    title: "Back to the Mine",
    body: "Your mining empire is waiting for you!",
  },
];

const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

export const getRandomGameNotification = (): GameNotification => {
  const roll = Math.random();

  if (roll < 0.6) {
    return getRandomItem(OFTEN_NOTIFICATIONS);
  }

  if (roll < 0.9) {
    return getRandomItem(SOMETIMES_NOTIFICATIONS);
  }

  return getRandomItem(RARELY_NOTIFICATIONS);
};

export const scheduleRandomGameNotification = async (intervalHours = 8) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const notification = getRandomGameNotification();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title,
      body: notification.body,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: intervalHours * 60 * 60,
      repeats: true,
    },
  });
};

export const cancelGameNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
