export class Pilot {
  constructor(
    public createdDt: Date,
    public email: string,
    public firstName: string,
    public lastName: string,
    public phoneNumber: string,
    public pilotId: string,
    public closestDistance?: number,
    public violationTimestamp?: any,
    public lastSeen?: any,
  ) {}
}
