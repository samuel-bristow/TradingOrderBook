// https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
export function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      
      let varA,varB;
      if(typeof key === 'string' && key.includes(".")){
        let keys = key.split(".");
        let key1 = keys[0];
        let key2 = keys[1];

        if (!a.hasOwnProperty(key1) || !b.hasOwnProperty(key1)) {
          // property doesn't exist on either object
          return 0;
        }
        if (!a[key1].hasOwnProperty(key2) || !b[key1].hasOwnProperty(key2)) {
          // property doesn't exist on either object
          return 0;
        }

        varA = (typeof a[key1][key2] === 'string')
          ? a[key1][key2].toUpperCase() : a[key1][key2];
        varB = (typeof b[key1][key2] === 'string')
          ? b[key1][key2].toUpperCase() : b[key1][key2];
      }
      else{
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // property doesn't exist on either object
          return 0;
        }
        varA = (typeof a[key] === 'string')
          ? a[key].toUpperCase() : a[key];
        varB = (typeof b[key] === 'string')
          ? b[key].toUpperCase() : b[key];
      }
      
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }