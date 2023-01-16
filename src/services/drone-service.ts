import X2JS from 'x2js';
import { DroneResponse } from '../models/drone-model';
import fetchNoCors from 'fetch-no-cors';

export class DroneService {
  public static async getDrones(): Promise<DroneResponse> {
    const proxyUrl = 'https://mysterious-hollows-95764.herokuapp.com/';
    const endpointUrl = 'https://assignments.reaktor.com/birdnest/drones';
    const options = { method: 'GET' }

    const droneResponse = async (endpointUrl, options, CORS_ANYWHERE) => {
      const response = await fetchNoCors(endpointUrl, options, CORS_ANYWHERE)
      const body = await response.text();
      const x2js = new X2JS();
      if (response.status === 200) {
        return x2js.xml2js(body) as DroneResponse;
      } else {
        // TODO: improve error handling
        console.error('Error occurred')
      }
    }

    return await droneResponse(endpointUrl, options, proxyUrl);
  }
}
