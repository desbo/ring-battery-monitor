import {RingApi} from "ring-client-api";

interface BatteryLevel {
  deviceName: string,
  leftLevel?: number,
  rightLevel?: number
}

interface BatteryCheckResult {
  left?: boolean,
  right?: boolean
}

export const checkBatteryLevel = (
  level: BatteryLevel,
  check: (_: number) => boolean
): BatteryCheckResult => ({
  ...level.leftLevel && {left: check(level.leftLevel)},
  ...level.rightLevel && {right: check(level.rightLevel)},
});

export const batteryLife = async (ring: RingApi): Promise<BatteryLevel[]> =>
  (await ring.getCameras()).map((camera) => {
    if ("battery_life" in camera.data) {
      return {
        deviceName: camera.data.description,
        leftLevel: +(camera.data.battery_life || 0),
        rightLevel: +(camera.data.battery_life_2 || 0),
      };
    }

    return {
      deviceName: camera.data.description,
    };
  });
