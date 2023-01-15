import X2JS from 'x2js';
import { DroneResponse } from '../models/drone-model';

export class DroneService {
  public static async getDrones(): Promise<DroneResponse> {
    const request = new Request('https://assignments.reaktor.com/birdnest/drones', { method: 'GET' });
    const response = await fetch(request);
    const body = await response.text();
    const x2js = new X2JS();

    if (response.status === 200) {
      return x2js.xml2js(body) as DroneResponse;
    } else {
      // TODO: improve error handling
      console.error('Error occurred')
    }
  }
}
