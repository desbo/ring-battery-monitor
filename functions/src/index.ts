const { onRequest } = require('firebase-functions/v2/https');
const { defineString } = require('firebase-functions/params');

import { RingApi } from "ring-client-api";
import { batteryLife } from "./ring"

const refreshToken = defineString('REFRESH_TOKEN');

export const batteryLevels = onRequest(
  { refreshToken },
  async (req, res) => {
    const client = new RingApi({ refreshToken })
    const levels = await batteryLife(client)
    res.send(levels)
  }
);
