import { Component, h, Host, State } from '@stencil/core';
import { DroneService } from '../../services/drone-service';
import { Drone, DroneResponse } from '../../models/drone-model';
import { PilotService } from '../../services/pilot-service';
import { Pilot } from '../../models/pilot-model';
import {
  calculateDistanceFromCenter,
  isOlderThanTenMinutes,
  readAllExistingPilotDataFromLocalStorage,
  readPilotDataFromLocalStorage,
  removePilotDataFromLocalStorage, timeSince,
  writePilotInformationToLocalStorage,
} from '../../utils/utils';

@Component({
  tag: 'birdnest-nt',
  styleUrl: 'birdnest-nt.scss',
  shadow: true
})
export class Birdnest {
  private updateTimer: number;

  @State() storedPilots: Pilot[] = [];
  @State() capturedDrones: Drone[] = [];

  public connectedCallback(): void {
    this.updateTimer = window.setInterval(() => {
      this.getDrones().then((response: DroneResponse) => {
        const captureTimestamp = response.report.capture._snapshotTimestamp;
        this.capturedDrones = response.report.capture.drone;
        this.checkForViolations(captureTimestamp);
        this.sortPilotsByLastSeen();
      })
    }, 5000); // 5 seconds
  }

  public componentWillLoad(): void {
    this.storedPilots = readAllExistingPilotDataFromLocalStorage();
    this.checkForExpiredPilotData();
    this.sortPilotsByLastSeen();
  }

  public disconnectedCallback(): void {
    window.clearInterval(this.updateTimer);
  }

  render() {
    return (
      <Host>
        <div class={'container'}>
          <table>
            <tr class={'heading-tr'}>
              <th colSpan={5}>NDZ Violators</th>
            </tr>
            <tr class={'sub-heading-tr'}>
              <td colSpan={5}>Drone Pilots caught violating the NDZ rule within last 10 minutes</td>
            </tr>
            <tr>
              <th>Name:</th>
              <th>E-mail:</th>
              <th>Phone:</th>
              <th>Closest distance to nest:</th>
              <th>Last seen:</th>
            </tr>
          {
            this.storedPilots.map(pilot => {
              return (
                <tr>
                  <td>{pilot.firstName + ' ' + pilot.lastName}</td>
                  <td>{pilot.email}</td>
                  <td>{pilot.phoneNumber}</td>
                  <td>{pilot.closestDistance + ' meters'}</td>
                  <td>{timeSince(pilot.lastSeen)}</td>
                </tr>
              )
            })
          }
          <tr class={'footer'}>
            <th colSpan={5}>
              <a target={'_blank'} href={'https://www.nicotukiainen.com'}>© Nico Tukiainen 2023</a>
            </th>
          </tr>
          </table>
        </div>
      </Host>
    )
  }

  private async getDrones(): Promise<DroneResponse>{
    return await DroneService.getDrones();
  }

  private checkForViolations(captureTimestamp: string): void {
    this.capturedDrones.forEach((drone: Drone) => {
      const distanceFromCenter: number = calculateDistanceFromCenter({ x: drone.positionX, y: drone.positionY });
      if (distanceFromCenter < 100) {
        this.getViolatingPilotInfo(
          drone.serialNumber,
          distanceFromCenter,
          captureTimestamp
        );
      }
    });
    this.checkForExpiredPilotData();
  }

  private async getViolatingPilotInfo(serialNumber: string, closestDistance: number, captureTimestamp: string): Promise<Pilot> {
    const violatingPilot = await PilotService.getPilots(serialNumber);
    violatingPilot.closestDistance = Math.trunc(closestDistance);
    violatingPilot.violationTimestamp = new Date(captureTimestamp);
    violatingPilot.lastSeen = violatingPilot.violationTimestamp;
    if (this.storedPilots.length > 0 && this.storedPilots.some((pilot: Pilot) => pilot.pilotId === violatingPilot.pilotId)) {
      return
    } else {
      writePilotInformationToLocalStorage(violatingPilot.pilotId, violatingPilot);
      this.storedPilots = [...this.storedPilots, (readPilotDataFromLocalStorage(violatingPilot.pilotId))];
    }
  }

  private checkForExpiredPilotData(): void {
    this.storedPilots.forEach((pilot: Pilot) => {
      if (pilot.violationTimestamp) {
        isOlderThanTenMinutes(pilot.violationTimestamp) ? this.removeExpiredPilot(pilot.pilotId) : null;
      }
    });
  }

  private removeExpiredPilot(pilotId: string): void {
    this.storedPilots.filter(storedPilot => storedPilot.pilotId !== pilotId);
    const expiredPilot = this.storedPilots.findIndex((pilot: Pilot) => pilot.pilotId === pilotId);
    if (expiredPilot > -1) {
      this.storedPilots.splice(expiredPilot, 1);
    }
    removePilotDataFromLocalStorage(pilotId);
  }

  private sortPilotsByLastSeen(): void {
    this.storedPilots.sort((a: Pilot, b: Pilot) => a.lastSeen.localeCompare(b.lastSeen));
  }
}
