import { RingApi } from 'ring-client-api'

interface BatteryLevel {
  deviceName: string,
  leftLevel?: number,
  rightLevel?: number
}

export const batteryLife = async (ring: RingApi): Promise<BatteryLevel[]> =>
  (await ring.getCameras()).map(camera => {
    if ("battery_life" in camera.data) {
      return {
        deviceName: camera.data.description,
        leftLevel: +(camera.data.battery_life || 0),
        rightLevel: +(camera.data.battery_life_2 || 0)
      }
    }

    return {
      deviceName: camera.data.description
    }
  }) 
