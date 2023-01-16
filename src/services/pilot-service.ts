import { Pilot } from '../models/pilot-model';
import fetchNoCors from 'fetch-no-cors';

export class PilotService {
  public static async getPilots(serialNumber: string): Promise<Pilot> {
    const proxyUrl = 'https://mysterious-hollows-95764.herokuapp.com/';
    const endpointUrl = `https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`;
    const options = { method: 'GET' }

    const pilotResponse = async (endpointUrl, options, CORS_ANYWHERE) => {
      const response = await fetchNoCors(endpointUrl, options, CORS_ANYWHERE);
      if (response.status === 200) {
        return response.json() as Pilot;
      } else {
        // TODO: improve error handling
        console.error('Error occurred')
      }
    }

    return await pilotResponse(endpointUrl, options, proxyUrl);
  }
}

