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
}

export const app = new App();
