import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";

import {RingApi} from "ring-client-api";
import {batteryLife} from "./ring";

const refreshToken = defineSecret("REFRESH_TOKEN");

export const batteryLevels = onRequest(
  {secrets: [refreshToken]},
  async (req, res) => {
    const client = new RingApi({refreshToken: refreshToken.value()});
    const levels = await batteryLife(client);
    res.send(levels);
  }
);
