import { computed, observable } from 'mobx';

class App {
  @observable
  planTemplateString = "";
  @observable
  locationNames = ["Drinksbar"];
  @observable
  timeNames = ["21-22"];
  @observable
  personsString = "SEKR";
  @observable
  persons = ["SEKR"];
  @observable
  focusPersonIndex: number | null = null;
  @observable
  personsWorkslots: [number, number, boolean][][] = [[]];
  @observable
  focusPlanCoordinates: number[] | null = null;

  @computed get personWorkslotMap() {
    const byPerson: {[timeIndex: number]: {[locationIndex: number]: {isSupervisor: boolean}}}[] = [];
    for (let i = 0; i < this.persons.length; ++i) {
      const workslotMap: {[t: number]: {[l: number]: {isSupervisor: boolean}}} = {};
      for (const [t, l, isSupervisor] of this.personsWorkslots[i]) {
        if (!workslotMap[t]) workslotMap[t] = {};
        workslotMap[t][l] = {isSupervisor};
      }
      byPerson.push(workslotMap);
    }
    return byPerson;
  }

  isFocusedPersonInSlot(t: number, l: number): boolean {
    if (this.focusPersonIndex == null) {
      return false;
    }
    const byLocation = this.personWorkslotMap[this.focusPersonIndex][t];
    if (!byLocation) {
      return false;
    }
    return byLocation[l] !== undefined;
  }

  isTimeSlotInFocus(t: number, l: number) {
    return app.focusPlanCoordinates != null &&
      app.focusPlanCoordinates[0] === t &&
      app.focusPlanCoordinates[1] === l;
  }
}

export const app = new App();
