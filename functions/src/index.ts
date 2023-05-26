import {onRequest} from "firebase-functions/v2/https";
import {defineSecret, defineString} from "firebase-functions/params";

import {RingApi} from "ring-client-api";
import {batteryLife, checkBatteryLevel} from "./ring";

import {sendEmail} from "./email";

const ringRefreshToken = defineSecret("RING_REFRESH_TOKEN");
const sendGridApiKey = defineSecret("SENDGRID_API_KEY");

const emailSender = defineString("EMAIL_SENDER");
const emailRecipient = defineString("EMAIL_RECIPIENT");

export const notifyOnLowBattery = onRequest(
  {secrets: [ringRefreshToken, sendGridApiKey], region: "europe-west1"},
  async (req, res) => {
    const client = new RingApi({refreshToken: ringRefreshToken.value()});
    const allLevels = await batteryLife(client);

    const lowBattery = allLevels.find((levels) =>
      checkBatteryLevel(levels, (l) => l < 100)
    );

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

    res.send(allLevels);
  }
);
