import { Pilot } from '../models/pilot-model';

export class PilotService {
  public static async getPilots(serialNumber: string): Promise<Pilot> {
    const response = await fetch(`https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`, { method: 'GET' })
      .then(response => response.json())

    if (response) {
      return response as Pilot;
    } else {
      return null;
    }
  }
}
