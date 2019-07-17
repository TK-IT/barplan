import { observable } from 'mobx';

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
  personsWorkslots: (number | boolean)[][][] = [[[]]];
  @observable
  focusPlanCoordinates: number[] | null = null;

  isFocusedPersonInSlot(t: number, l: number) {
    if (this.focusPersonIndex == null) {
      return false;
    }
    return app.personsWorkslots[this.focusPersonIndex].some(
      slot => slot[0] === t && slot[1] === l
    );
  }

  isTimeSlotInFocus(t: number, l: number) {
    return app.focusPlanCoordinates != null &&
      app.focusPlanCoordinates[0] === t &&
      app.focusPlanCoordinates[1] === l;
  }
}

export const app = new App();
