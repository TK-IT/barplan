import * as React from "react";
import * as ReactDOM from "react-dom";
import styles from "./index.scss";
import { observer } from "mobx-react";
import { observable, action } from "mobx";

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
}

export const app = new App();

@observer
class AppComponent extends React.Component<{}, {}> {
  render() {
    return <>
      <div>
        <b> Hello <span className={styles.TheName}>{app.navn}</span> </b>
        <input
          value={app.navn}
          onChange={e => {
            app.navn = e.target.value;
          }}
        />
      </div>
      <b>Plan</b>
      <div>
          <textarea value={app.planTemplateString} onChange={e => this.parsePlanTemplateString(e.target.value)}/>
      </div>
      <div>
        <b>Personer</b>
        <div>
          <textarea value={app.personsString} onChange={e => this.parsePersonsString(e.target.value)}/>
      </div>
      </div>
      <div>
        <table>
          <tbody>
            { app.persons.map(name => <tr><td>{name}</td>{app.locationNames.map( _loc => <td>0</td>)}</tr>) }
          </tbody>
        </table>
      </div>
    </>;
  }

  @action
  parsePlanTemplateString (s: string) {
    app.planTemplateString = s;
    const rows = s.split("\n");
    app.locationNames = rows[0].trim().split("\t");
    app.timeNames = rows.slice(1).map(row => row.split('\t')[0].trim());
  }

  @action
  parsePersonsString(s: string) {
    app.personsString = s;
    const rows = s.split("\n");
    app.persons = rows.map(row => row.split('\t')[0].trim()).filter(name => name != '');
  }
}

ReactDOM.render(<AppComponent />, document.getElementById("root"));
