import { action, computed, observable } from "mobx";

import defaultPersonsString from "../sampledata/personer.txt";
import defaultPlanTemplateString from "../sampledata/plan.txt";

class App {
  @observable
  planTemplateString = defaultPlanTemplateString;
  @observable
  locationNames: string[] = [];
  @observable
  timeNames: string[] = [];
  @observable
  personsString = defaultPersonsString;
  @observable
  persons: string[] = [];
  @observable
  focusPersonIndex: number | null = null;
  @observable
  focusPlanCoordinates: number[] | null = null;
  @observable
  personsWorkslots: [number, number, boolean][][] = [[]];
  @observable
  closedWorkslots: [number, number][] = [];

  @computed get personWorkslotMap() {
    const byPerson: {
      [timeIndex: number]: {
        [locationIndex: number]: { isSupervisor: boolean };
      };
    }[] = [];
    for (let i = 0; i < this.persons.length; ++i) {
      const workslotMap: {
        [t: number]: { [l: number]: { isSupervisor: boolean } };
      } = {};
      for (const [t, l, isSupervisor] of this.personsWorkslots[i]) {
        if (!workslotMap[t]) workslotMap[t] = {};
        workslotMap[t][l] = { isSupervisor };
      }
      byPerson.push(workslotMap);
    }
    return byPerson;
  }

  isFocusedPersonInSlot(t: number, l: number): boolean {
    if (this.focusPersonIndex == null) {
      return false;
    }
    return this.isPersonInSlot(this.focusPersonIndex, t, l);
  }

  isPersonInSlot(personIndex: number, t: number, l: number): boolean {
    const byLocation = this.personWorkslotMap[personIndex][t];
    if (!byLocation) {
      return false;
    }
    return byLocation[l] !== undefined;
  }

  isTimeSlotInFocus(t: number, l: number) {
    return (
      app.focusPlanCoordinates != null &&
      app.focusPlanCoordinates[0] === t &&
      app.focusPlanCoordinates[1] === l
    );
  }

  @action
  addPersonInFocusToSlot() {
    if (this.focusPersonIndex != null && this.focusPlanCoordinates != null) {
      const [t, l] = this.focusPlanCoordinates;
      this.addPersonToSlot(t, l, this.focusPersonIndex);
    }
  }

  @action
  addPersonToSlot(t: number, l: number, personIndex: number) {
    if (this.isPersonInSlot(personIndex, t, l)) return;
    this.personsWorkslots[personIndex].push([t, l, false]);
  }

  @action
  removePersonInFocusFromSlot() {
    if (this.focusPersonIndex != null && this.focusPlanCoordinates != null) {
      const [t, l] = this.focusPlanCoordinates;
      const focusIndex = this.focusPersonIndex;
      this.personsWorkslots[this.focusPersonIndex].forEach((coord, i) => {
        if (coord[0] === t && coord[1] === l) {
          app.personsWorkslots[focusIndex].splice(i, 1);
        }
      });
    }
  }

  @action
  removeAsSupervisor(personIndex: number, t: number, l: number): void {
    this.setSupervisorStatusForPersonWorkingOnFocusedTimeslot(
      personIndex,
      t,
      l,
      false
    );
  }

  @action
  addAsSupervisor(personIndex: number, t: number, l: number): void {
    // Find and remove a current supervisor
    for (let i = 0; i < this.persons.length; i++) {
      this.personsWorkslots[i].forEach(slot => {
        if (slot[0] === t && slot[1] === l && slot[2] === true) {
          slot[2] = false;
        }
      });
    }
    this.setSupervisorStatusForPersonWorkingOnFocusedTimeslot(
      personIndex,
      t,
      l,
      true
    );
  }

  @action
  setSupervisorStatusForPersonWorkingOnFocusedTimeslot(
    personIndex: number,
    t: number,
    l: number,
    supervisorStatus: boolean
  ) {
    this.personsWorkslots[personIndex].forEach(slot => {
      if (slot[0] === t && slot[1] === l) {
        slot[2] = supervisorStatus;
      }
    });
  }
}

export const app = new App();
