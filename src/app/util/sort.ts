export class Sort {
  private sortOrder = 1;
  private collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });

  constructor() {}

  public startSort(parent: any, property: any, order: any, type = '') {
    if (order === 'desc') {
      this.sortOrder = -1;
    }
    return (a: any, b: any) => {
      console.log(
        a,
        b,
        a[property],
        b[property],
        this.sortData(a[property], b[property])
      );
      a = a[parent] ? a[parent][property] : a[property];
      b = b[parent] ? b[parent][property] : b[property];

      if (type === 'date') {
        return this.sortData(new Date(a), new Date(b));
      } else {
        return this.sortData(a, b);
      }
    };
  }

  private sortData(a: any, b: any) {
    if (a < b) {
      return -1 * this.sortOrder;
    } else if (a > b) {
      return 1 * this.sortOrder;
    } else {
      return 0 * this.sortOrder;
    }
  }
}
