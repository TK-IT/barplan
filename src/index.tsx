import { action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { app } from './app';
import styles from './index.scss';

@observer
class AppComponent extends React.Component<{}, {}> {
  render() {
    return (
      <>
        <div>
          <b>
            {" "}
            Hello <span className={styles.TheName}>{app.navn}</span>{" "}
          </b>
          <input
            value={app.navn}
            onChange={e => {
              app.navn = e.target.value;
            }}
          />
        </div>
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
          <div>
            <PersonList />
          </div>
          <div>
            <Plan />
          </div>
          <div>
            <ControlPanel />
          </div>
        </div>
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
    app.personsWorkslots = [];
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
                onClick={() => (app.focusPersonIndex = i)}
                className={
                  app.focusPersonIndex === i ? styles.personInFocus : ""
                }
              >
                {name}
              </td>
              {app.locationNames.map(_loc => (
                <td>0</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
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
                  onClick={() => (app.focusPlanCoordinates = [t, l])}
                  className={
                    //this.focusedPersonInSlot(t, l) ? styles.personInFocus+" "+styles.timeSlotInFocus : ""
                    this.getSlotClassName(t, l)
                  }
                >
                  {this.listWorkers(t, l)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  getSlotClassName(t: number, l: number) {
    var className = "";
    if (app.isFocusedPersonInSlot(t, l)) {
      className += styles.personInFocus;
    }
    if (app.focusPlanCoordinates != null) {
      if (
        app.focusPlanCoordinates[0] === t &&
        app.focusPlanCoordinates[1] === l
      )
        className += " " + styles.timeSlotInFocus;
    }
    return className.trimLeft();
  }

  listWorkers(t: number, l: number) {
    var workersList = "";
    app.persons.forEach((person, i) => {
      app.personsWorkslots[i].forEach(slot => {
        if (slot[0] === t && slot[1] === l) {
          workersList += " " + person + " ";
        }
      });
    });
    return workersList;
  }
}

@observer
class ControlPanel extends React.Component<{}, {}> {
  render() {
    if (app.focusPlanCoordinates != null) {
      return (
        <>
        <div>
          <b>
            {app.locationNames[app.focusPlanCoordinates[1]] +
              " kl. " +
              app.timeNames[app.focusPlanCoordinates[0]]}
          </b>
        </div>
        <div>
          {this.addOrRemoveButton()}
        </div>
        </>
      );
    } else {
      return "";
    }
  }

  addOrRemoveButton() {
    if (app.focusPlanCoordinates != null) {
      if (app.isFocusedPersonInSlot(app.focusPlanCoordinates[0], app.focusPlanCoordinates[1])) {
        return (
          <button
            onClick={_e => this.addPersonInFocusToSlot()}
          >
            Tilføj til vagt
          </button>
        );
      } else {
        return (
          <button
            onClick={_e => this.addPersonInFocusToSlot()}
          >
            Tilføj til vagt
          </button>
        );
      }
    }
  }

  addPersonInFocusToSlot(){
    if (app.focusPersonIndex != null && app.focusPlanCoordinates != null){
      app.personsWorkslots[app.focusPersonIndex].push(app.focusPlanCoordinates);
    }
  }
}


ReactDOM.render(<AppComponent />, document.getElementById("root"));
