export function classNames(classes: { [className: string]: any }) {
  let classNames = [];
  for (const k in classes) {
    if (classes[k]) classNames.push(k);
  }
  return classNames.join(" ");
}

export function mapStringList(list: string[]): [string, number][] {
  let result: [string, number][] = [];
  let index = 0;
  for (const item of list) {
    result.push([item, index]);
    index++;
  }
  return result;
}
