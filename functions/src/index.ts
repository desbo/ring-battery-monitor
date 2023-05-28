import {onSchedule} from "firebase-functions/v2/scheduler";
import {defineSecret, defineString} from "firebase-functions/params";
import {log} from "firebase-functions/logger";

import {RingApi} from "ring-client-api";
import {batteryLife, checkBatteryLevel} from "./ring";

import {sendEmail} from "./email";

const ringRefreshToken = defineSecret("RING_REFRESH_TOKEN");
const sendGridApiKey = defineSecret("SENDGRID_API_KEY");

const emailSender = defineString("EMAIL_SENDER");
const emailRecipient = defineString("EMAIL_RECIPIENT");

export const notifyOnLowBattery = onSchedule({
  schedule: "every day 06:00",
  region: "europe-west1",
  secrets: [ringRefreshToken, sendGridApiKey],
}, async () => {
  const client = new RingApi({refreshToken: ringRefreshToken.value()});
  const allLevels = await batteryLife(client);

  const lowBattery = allLevels.find((levels) => {
    const result = checkBatteryLevel(levels, (l) => l < 10);
    result.left || result.right;
  });

  if (lowBattery) {
    sendEmail(
      sendGridApiKey.value(),
      emailSender.value(),
      emailRecipient.value(),
      "low battery in Ring camera",
      (lowBattery.leftLevel ? `left level: ${lowBattery.leftLevel}%\n` : "") +
      (lowBattery.rightLevel ? `right level: ${lowBattery.rightLevel}%` : "")
    );
  }

  log(allLevels);
});
