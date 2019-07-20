import { action } from 'mobx';

import { app } from './app';

const best = ["SEKR", "PR", "FORM", "NF", "INKA", "KA$$", "KASS", "CERM", "VC"];

class PlanGenrator {
  @action
  generatePlan() {
    for (let t=0 ; t<app.timeNames.length ; t++) {
      for (let l=0 ; l<app.locationNames.length ; l++) {
        if (app.closedWorkslots.some(slot => slot[0] === t && slot[1] === l)) {}
        else if (app.locationNames[l] === "Drinksbar") {
          this.fillSlot(t,l,6)
        } else if (app.locationNames[l] === "Kamera") {
          this.fillSlot(t,l,1)
        } else {
          this.fillSlot(t,l,3)
        }
      }
    }
  }

  @action
  fillSlot(time: number, location: number, amount: number) {
    let workers = 0;
    while (workers<amount) {
      const randNum = Math.floor(Math.random() * app.persons.length)
      if (!app.personsWorkslots[randNum].some(slot => slot[0] == time)) {
        if (app.personsWorkslots[randNum].length<3 && !best.some(name => name === app.persons[randNum])) {
            app.personsWorkslots[randNum].push([time, location, false]);
            workers++;
        } else if (best.some(name => name == app.persons[randNum])) {
            app.personsWorkslots[randNum].push([time, location, false]);
            workers++;
        }
      }
    }
  }

}
export const planGenerator = new PlanGenrator();
