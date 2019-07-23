import { app } from "./app";

class Parser {
  parsePlanToLaTeXString() {
    let latexContent =
      "\\centering\n\\hspace*{-1.5cm}\\begin{tabular}{l|" +
      "c".repeat(app.locationNames.length) +
      "l}\n\\toprule\n\\textbf{Tid.}";
    for (const location of app.locationNames) {
      latexContent += " & \\textbf{" + location + "}";
    }
    latexContent += "\\\\\n\\midrule\n";
    for (const [t, time] of app.timeNames.entries()) {
      latexContent += time;
      for (let l = 0; l < app.locationNames.length; l++) {
        latexContent += " & ";
        if (!app.workslotClosed(t, l)) {
          let supervisor = app.supervisorExsist(t, l);
          let workers = app.persons
            .map((_, i) => i)
            .filter(i => app.isPersonInSlot(i, t, l));
          if (supervisor !== null) {
            latexContent +=
              "\\textbf{" +
              this.checkForSpecialNameing(app.persons[supervisor]) +
              "} ";
            workers = workers.filter(i => i !== supervisor);
          }
          for (const i of workers) {
            latexContent += this.checkForSpecialNameing(app.persons[i]) + " ";
          }
        } else {
          latexContent += " -- ";
        }
      }
      latexContent += "\\\\\n";
    }
    latexContent += "\\bottomrule\n\\end{tabular}";
    return latexContent;
  }

  checkForSpecialNameing(name: string): string {
    name = name.replace("KASS", "\\KASS");
    name = name.replace("KA$$", "\\KASS");
    name = name.replace("VC", "\\VC");
    name = name.replace("CERM", "\\CERM");
    return name;
  }

  parsePlanToCSVString() {
    let rows = "\t";
    for (const location of app.locationNames) {
      rows += location + "\t";
    }
    rows += "\n";
    for (const [t, time] of app.timeNames.entries()) {
      rows += time + "\t";
      for (let l = 0; l < app.locationNames.length; l++) {
        let supervisor = app.supervisorExsist(t, l);
        let workers = app.persons
          .map((_, i) => i)
          .filter(i => app.isPersonInSlot(i, t, l));
        if (supervisor !== null) {
          rows += "[" + app.persons[supervisor] + "]" + " ";
          workers = workers.filter(i => i !== supervisor);
        }
        for (const i of workers) {
          rows += app.persons[i] + " ";
        }
        rows += "\t";
      }
      rows += "\n";
    }
    return rows;
  }
}

export const parser = new Parser();
