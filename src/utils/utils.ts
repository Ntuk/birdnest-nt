import { Pilot } from '../models/pilot-model';
import { Coordinates } from '../types/types';

export function writePilotInformationToLocalStorage(pilotId: string, pilotInfo: Pilot): void {
  localStorage.setItem(pilotId, JSON.stringify(pilotInfo));
}

export function readPilotDataFromLocalStorage(pilotId: string): Pilot {
  const pilot = JSON.parse(localStorage.getItem(pilotId)!);
  if (pilot) {
    return pilot
  }
}

export function readAllExistingPilotDataFromLocalStorage(): Pilot[] {
  const allPilotIds: string[] = Object.keys(localStorage);
  if (allPilotIds) {
    let allPilots: Pilot[];
    allPilots = allPilotIds.map((pilotId: string) => JSON.parse(localStorage.getItem(pilotId)));
    allPilots.filter((pilot: Pilot) => isOlderThanTenMinutes(pilot.violationTimestamp));
    return allPilots;
  }
}

export function removePilotDataFromLocalStorage(pilotId: string): void {
  localStorage.removeItem(pilotId);
}

export function calculateDistanceFromCenter(coordinates: Coordinates): number {
  const center: Coordinates = { x: 250000, y: 250000 };
  const distance: number = Math.sqrt(
    Math.pow(coordinates.x - center.x, 2) +
    Math.pow(coordinates.y - center.y, 2)
  );
  return distance / 1000;
}

export function timeSince(violationTimestamp: Date) {
  const currentTime = new Date();
  const difference = currentTime.valueOf() - new Date(violationTimestamp).valueOf();
  const secondsSince = Math.floor(difference / 1000);
  const minutesSince = Math.trunc(secondsSince / 60);

  if (secondsSince === 0) {
    return 'right now'
  } else if (secondsSince === 1) {
    return secondsSince + ' second ago'
  } else if (secondsSince >= 60 && secondsSince <= 119) {
    return minutesSince + ' minute ago'
  } else if (secondsSince >= 119) {
    return minutesSince + ' minutes ago'
  } else {
    return secondsSince + ' seconds ago'
  }
}

export function isOlderThanTenMinutes(captureTimestamp: Date): boolean {
  const currentTime: Date = new Date();
  const captureTime: Date = new Date(captureTimestamp);
  const tenMinutesPastCaptureTime = new Date(captureTime.getTime() + (10 * 60 * 1000));
  return currentTime > tenMinutesPastCaptureTime;
}
