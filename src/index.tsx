import * as React from "react";
import * as ReactDOM from "react-dom";
import styles from "./index.scss";
import { observer } from "mobx-react";
import { observable } from "mobx";

class App {
    @observable
    navn = "";
}

export const app = new App();

@observer
class AppComponent extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <b> Hello <span className={styles.TheName}>{app.navn}</span> </b>
        <input
          value={app.navn}
          onChange={e => {
            app.navn = e.target.value;
          }}
        ></input>
      </div>
    );
  }
}

ReactDOM.render(<AppComponent />, document.getElementById("root"));
