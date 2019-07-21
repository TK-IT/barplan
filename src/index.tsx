import { action, configure } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { app } from "./app";
import { planGenerator } from "./generator";
import styles from "./index.scss";
import { classNames } from "./util";

@observer
class AppComponent extends React.Component<{}, {}> {
  componentDidMount() {
    this.parsePlanTemplateString(app.planTemplateString);
    this.parsePersonsString(app.personsString);
  }

  render() {
    return (
      <>
        <b>Plan</b>
        <div>
          <textarea
            value={app.planTemplateString}
            onChange={e => this.parsePlanTemplateString(e.target.value)}
          />
        </div>
        <div>
          <b>Personer</b>
          <div>
            <textarea
              value={app.personsString}
              onChange={e => this.parsePersonsString(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.editor}>
          <div className={styles.personsList}>
            <PersonList />
          </div>
          <div className={styles.plan}>
            <Plan />
          </div>
          <div className={styles.controlPanel}>
            <ControlPanel />
          </div>
        </div>
        <button onClick={_e => planGenerator.generatePlan()}>
          Generer Barplan
        </button>
      </>
    );
  }

  @action
  parsePlanTemplateString(s: string) {
    app.planTemplateString = s;
    const rows = s.split("\n");
    app.locationNames = rows[0].trim().split("\t");
    app.timeNames = rows.slice(1).map(row => row.split("\t")[0].trim());
  }

  @action
  parsePersonsString(s: string) {
    app.personsString = s;
    const rows = s.split("\n");
    app.persons = rows
      .map(row => row.split("\t")[0].trim())
      .filter(name => name != "");
    app.persons.forEach(_person => app.personsWorkslots.push([]));
  }
}

@observer
class PersonList extends React.Component<{}, {}> {
  render() {
    return (
      <table>
        <tbody>
          {app.persons.map((name, i) => (
            <tr>
              <td
                onClick={action(() => (app.focusPersonIndex = i))}
                className={
                  app.focusPersonIndex === i ? styles.personInFocus : ""
                }
              >
                {name}
              </td>
              {app.locationNames.map((_loc, l) => (
                <td>{this.numberOfTimeslotsOnLocation(l, i)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  numberOfTimeslotsOnLocation(l: number, i: number) {
    return app.personsWorkslots[i].filter(coord => coord[1] === l).length;
  }
}

@observer
class Plan extends React.Component<{}, {}> {
  render() {
    return (
      <table>
        <tbody>
          <tr>
            <td></td>
            {app.locationNames.map(loc => (
              <td>{loc}</td>
            ))}
          </tr>
          {app.timeNames.map((time, t) => (
            <tr>
              <td>{time}</td>
              {app.locationNames.map((_loc, l) => (
                <td
                  onClick={() => this.onClick(t, l)}
                  className={classNames({
                    [styles.personInFocus]: app.isFocusedPersonInSlot(t, l),
                    [styles.timeSlotInFocus]: app.isTimeSlotInFocus(t, l),
                    [styles.doubleBooking]: this.doubleBookingHasOccurred(t, l) // Will overwrite personInFocus
                  })}
                >
                  {this.workslotContentDecision(t, l)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  @action
  onClick(t: number, l: number) {
    app.focusPlanCoordinates = [t, l];
  }

  doubleBookingHasOccurred(t: number, l: number): boolean {
    for (let i = 0; i < app.persons.length; i++) {
      const timeSlotList = app.personsWorkslots[i].filter(
        slot => slot[0] === t
      );
      if (timeSlotList.length > 1 && timeSlotList.some(slot => slot[1] === l)) {
        return true;
      }
    }
    return false;
  }

  workslotContentDecision(t: number, l: number) {
    if (app.closedWorkslots.some(slot => slot[0] === t && slot[1] === l)) {
      return <b>-</b>;
    } else return this.listWorkers(t, l);
  }

  listWorkers(t: number, l: number) {
    const workersList: string[] = [];
    let supervisor = "";
    app.persons.forEach((person, i) => {
      app.personsWorkslots[i].forEach(slot => {
        if (slot[0] === t && slot[1] === l) {
          if (slot[2]) {
            supervisor = person;
          } else {
            workersList.push(person);
          }
        }
      });
    });
    return (
      <>
        <b>{supervisor}</b> {workersList.join(" ")}
      </>
    );
  }
}

@observer
class ControlPanel extends React.Component<{}, {}> {
  render() {
    if (app.focusPlanCoordinates == null) {
      return "";
    }
    const [t, l] = app.focusPlanCoordinates;
    return (
      <>
        <div>
          <b>
            {app.locationNames[l]} kl. {app.timeNames[t]}
          </b>
        </div>
        {this.buttons()}
      </>
    );
  }

  buttons() {
    if (app.focusPlanCoordinates == null) {
      return <></>;
    }
    const [t, l] = app.focusPlanCoordinates;
    if (app.closedWorkslots.some(slot => slot[0] === t && slot[1] === l)) {
      return (
        <div>
          <button onClick={_e => this.openWorkslot()}>Genåben vagt</button>
        </div>
      );
    } else {
      return (
        <>
          <div>{this.addOrRemoveButton()}</div>
          <div>{this.supervisorButton()}</div>
          <div>{this.workstationClosedButtons()}</div>
        </>
      );
    }
  }

  workstationClosedButtons() {
    if (app.focusPlanCoordinates == null) {
      return <></>;
    }
    let button = <></>;
    const [t, l] = app.focusPlanCoordinates;
    if (!app.closedWorkslots.some(slot => slot[0] === t && slot[1] === l)) {
      button = (
        <button onClick={_e => this.closeWorkslot()}>
          Lad denne vagt være lukket
        </button>
      );
    }
    return button;
  }

  @action
  closeWorkslot() {
    if (app.focusPlanCoordinates != null) {
      const [t, l] = app.focusPlanCoordinates;
      app.closedWorkslots.push([t, l]);
    }
  }

  @action
  openWorkslot() {
    if (app.focusPlanCoordinates != null) {
      const [t, l] = app.focusPlanCoordinates;
      app.closedWorkslots.forEach((coords, i) => {
        if (coords[0] === t && coords[1] === l) {
          app.closedWorkslots.splice(i, 1);
        }
      });
    }
  }

  supervisorButton() {
    if (app.focusPlanCoordinates == null) {
      return <></>;
    }
    let button = <></>;
    const [t, l] = app.focusPlanCoordinates;
    app.persons.forEach((_person, i) => {
      app.personsWorkslots[i].forEach(slot => {
        if (slot[0] === t && slot[1] === l && app.focusPersonIndex == i) {
          if (slot[2] === false) {
            button = (
              <button onClick={_e => this.addAsSupervisor(i)}>
                Gør til ansvarlig
              </button>
            );
          } else if (slot[2] === true) {
            button = (
              <button onClick={_e => this.removeAsSupervisor(i)}>
                Gør uansvarlig
              </button>
            );
          }
        }
      });
    });
    return button;
  }

  @action
  removeAsSupervisor(personIndex: number): void {
    this.setSupervisorStatusForPersonWorkingOnFocusedTimeslot(
      personIndex,
      false
    );
  }

  @action
  addAsSupervisor(personIndex: number): void {
    if (app.focusPlanCoordinates == null) {
    } else {
      // Find and remove a current supervisor
      const [t, l] = app.focusPlanCoordinates;
      for (let i = 0; i < app.persons.length; i++) {
        app.personsWorkslots[i].forEach(slot => {
          if (slot[0] === t && slot[1] === l && slot[2] === true) {
            slot[2] = false;
          }
        });
      }
      this.setSupervisorStatusForPersonWorkingOnFocusedTimeslot(
        personIndex,
        true
      );
    }
  }

  @action
  setSupervisorStatusForPersonWorkingOnFocusedTimeslot(
    personIndex: number,
    supervisorStatus: boolean
  ) {
    if (app.focusPlanCoordinates == null) {
    } else {
      const [t, l] = app.focusPlanCoordinates;
      app.personsWorkslots[personIndex].forEach(slot => {
        if (slot[0] === t && slot[1] === l) {
          slot[2] = supervisorStatus;
        }
      });
    }
  }

  addOrRemoveButton() {
    if (app.focusPlanCoordinates != null) {
      if (
        app.isFocusedPersonInSlot(
          app.focusPlanCoordinates[0],
          app.focusPlanCoordinates[1]
        )
      ) {
        return (
          <button onClick={_e => this.removePersonInFocusFromSlot()}>
            Fjern fra vagt
          </button>
        );
      } else if (app.focusPersonIndex != null) {
        return (
          <button onClick={_e => this.addPersonInFocusToSlot()}>
            Tilføj til vagt
          </button>
        );
      }
    }
    return "";
  }

  @action
  addPersonInFocusToSlot() {
    if (app.focusPersonIndex != null && app.focusPlanCoordinates != null) {
      app.personsWorkslots[app.focusPersonIndex].push([
        app.focusPlanCoordinates[0],
        app.focusPlanCoordinates[1],
        false
      ]);
    }
  }

  @action
  removePersonInFocusFromSlot() {
    if (app.focusPersonIndex != null && app.focusPlanCoordinates != null) {
      const [t, l] = app.focusPlanCoordinates;
      const focusIndex = app.focusPersonIndex;
      app.personsWorkslots[app.focusPersonIndex].forEach((coord, i) => {
        if (coord[0] === t && coord[1] === l) {
          app.personsWorkslots[focusIndex].splice(i, 1);
        }
      });
    }
  }
}

configure({ enforceActions: "always", computedRequiresReaction: true });
ReactDOM.render(<AppComponent />, document.getElementById("root"));
