import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { addDays, trialTimeline } from './timeline';

/**
 * The "Day 5 - we remind you" promise. A local notification scheduled on the device:
 * no server, push token or Firebase needed, and it fires even offline.
 */
const REMINDER_ID = 'trial-reminder';
const CHANNEL_ID = 'reminders';

/** Returns true if the reminder is scheduled (false if notifications are not allowed). */
export async function scheduleTrialReminder(start: Date, trialDays: number, billingDate: string): Promise<boolean> {
  const { reminderDay } = trialTimeline(trialDays);
  if (reminderDay === null) return false;
  try {
    const current = await Notifications.getPermissionsAsync();
    const status = current.granted ? current.status : (await Notifications.requestPermissionsAsync()).status;
    if (status !== 'granted') return false;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, { name: 'Reminders', importance: Notifications.AndroidImportance.DEFAULT });
    }
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => {});
    await Notifications.scheduleNotificationAsync({
      identifier: REMINDER_ID,
      content: { title: 'OnlyDM', body: `Your free trial ends on ${billingDate}. Billing starts then unless you cancel.` },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: addDays(start, reminderDay), channelId: CHANNEL_ID },
    });
    return true;
  } catch {
    return false;
  }
}

export function cancelTrialReminder() {
  Notifications.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => {});
}
