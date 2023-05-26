import {RingApi} from "ring-client-api";
import * as ring from "../src/ring";

const debug = async (refreshToken: string) => {
  console.log(process.argv);
  const ringClient = new RingApi({refreshToken});
  const batt = await ring.batteryLife(ringClient);
  console.log(batt);
};


debug(process.env.RING_REFRESH_TOKEN || "");
