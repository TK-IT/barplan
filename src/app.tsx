import { observable } from 'mobx';

class App {
  @observable
  navn = "";
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
  personsWorkslots = [[[0, 0]]];
  @observable
  focusPlanCoordinates: number[] | null = null;

  isFocusedPersonInSlot(t: number, l: number) {
    var inSlot = false;
    if (this.focusPersonIndex != null) {
      app.personsWorkslots[this.focusPersonIndex].forEach(slot => {
        if (slot[0] === t && slot[1] === l) {
          inSlot = true;
        }
      });
    }
    return inSlot;
  }
}

export const app = new App();
