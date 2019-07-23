import { action } from "mobx";
import * as React from "react";

import { app } from "./app";
import styles from "./index.scss";

class KeyHandler {
  // NB! Update shortcutHelp if shortcuts are changed
  shortcutHelp() {
    return (
      <div className={styles.shortcutHelp}>
        <h2>Genvejstaster:</h2>
        <b>Plan navigation:</b>
        <p>
          h: Venstre
          <br />
          j: Ned
          <br />
          k: Op
          <br />
          j: Højre
        </p>
        <b>Personliste navigation:</b>
        <p>
          w: Op
          <br />
          s: Ned
          <br />
        </p>
        <b>Handlinger:</b>
        <p>
          a: Tilføj til vagt
          <br />
          r: Fjern fra vagt
          <br />
          e: Gør ansvarlig/uansvarlig
          <br />
          c: Luk/åben vagt
          <br />
        </p>
      </div>
    );
  }

  @action
  onKeyPress(key: string) {
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
      case "w": {
        // personlist move up
        if (app.focusPersonIndex === null) app.focusPersonIndex = 0;
        else
          app.focusPersonIndex =
            app.focusPersonIndex === 0
              ? app.persons.length - 1
              : app.focusPersonIndex - 1;
        break;
      }
      case "s": {
        // personlist move down
        if (app.focusPersonIndex === null) app.focusPersonIndex = 0;
        else
          app.focusPersonIndex =
            app.focusPersonIndex === app.persons.length - 1
              ? 0
              : app.focusPersonIndex + 1;
        break;
      }
      case "a": {
        // Add person in focus to workslot in focus
        app.addPersonInFocusToSlot();
        break;
      }
      case "r": {
        // Remove person in focus to workslot in focus
        app.removePersonInFocusFromSlot();
        break;
      }
      case "e": {
        if (
          app.focusPersonIndex !== null &&
          app.focusPlanCoordinates !== null
        ) {
          const [t, l] = app.focusPlanCoordinates;
          const i = app.focusPersonIndex;
          const supervisorIndex = app.supervisorExsist(t, l);
          if (supervisorIndex === null) {
            app.addAsSupervisor(i, t, l);
          } else if (supervisorIndex === i) {
            app.removeAsSupervisor(i, t, l);
          }
        }
        break;
      }
      case "c": {
        // Close or reopen workslot
        if (app.focusPlanCoordinates !== null) {
          const [t, l] = app.focusPlanCoordinates;
          if (
            app.closedWorkslots.some(
              coords => coords[0] === t && coords[1] === l
            )
          ) {
            app.openWorkslot(t, l);
          } else {
            app.closeWorkslot(t, l);
          }
        }
        break;
      }
    }
  }
}

export const keyHandler = new KeyHandler();
