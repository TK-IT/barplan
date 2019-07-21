import { action } from "mobx";

import { app } from "./app";

class KeyHandler {
  @action
  onKeyPress(key: string) {
    //console.log(key)
    //console.log(app.focusPlanCoordinates)
    switch (key) {
      case "h": {
        // plan move left
        if (app.focusPlanCoordinates === null)
          app.focusPlanCoordinates = [0, 0];
        else if (app.focusPlanCoordinates[1] !== 0)
          app.focusPlanCoordinates[1] -= 1;
        break;
      }
      case "j": {
        // plan move down
        if (app.focusPlanCoordinates === null)
          app.focusPlanCoordinates = [0, 0];
        else if (app.focusPlanCoordinates[0] !== app.timeNames.length - 1)
          app.focusPlanCoordinates[0] += 1;
        break;
      }
      case "k": {
        // plan move up
        if (app.focusPlanCoordinates === null)
          app.focusPlanCoordinates = [0, 0];
        else if (app.focusPlanCoordinates[0] !== 0)
          app.focusPlanCoordinates[0] -= 1;
        break;
      }
      case "l": {
        // plan move right
        if (app.focusPlanCoordinates === null)
          app.focusPlanCoordinates = [0, 0];
        else if (app.focusPlanCoordinates[1] !== app.locationNames.length - 1)
          app.focusPlanCoordinates[1] += 1;
        break;
      }
    }
  }
}

export const keyHandler = new KeyHandler();
