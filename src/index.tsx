import * as React from "react";
import * as ReactDOM from "react-dom";

class AppComponent extends React.Component<{}, {}> {
    render() {return <b> Hello Rav </b>}
    }

ReactDOM.render(<AppComponent />, document.getElementById("root"));
