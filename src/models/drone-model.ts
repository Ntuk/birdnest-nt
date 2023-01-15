export class DroneResponse {
  constructor(
    public report: Report
  ) {}
}

export class Report {
  constructor(
    public capture: Capture,
    public deviceInformation: DeviceInformation
  ) {}
}

export class Capture {
  constructor(
    public drone: Drone[],
    public _snapshotTimestamp: string
  ) {}
}

export class Drone {
  constructor(
    public altitude: string,
    public firmware: string,
    public ipv4: string,
    public ipv6: string,
    public mac: string,
    public manufacturer: string,
    public model: string,
    public positionX: number,
    public positionY: number,
    public serialNumber: string
  ) {}
}

export class DeviceInformation {
  constructor(
    public deviceStarted: string,
    public listenrange: string,
    public updatedIntervalMs: string,
    public uptimeSeconds: string,
    public deviceId: string
  ) {}
}
