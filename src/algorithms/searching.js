export function linearSearch(array, target) {
  const steps = [];
  
  for (let i = 0; i < array.length; i++) {
    steps.push({
      comparing: [i],
      found: array[i] === target,
      index: array[i] === target ? i : null
    });
    
    if (array[i] === target) {
      break;
    }
  }

  return steps;
}

export function binarySearch(array, target) {
  const steps = [];
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    steps.push({
      comparing: [mid],
      left,
      right,
      mid,
      found: array[mid] === target,
      index: array[mid] === target ? mid : null
    });

    if (array[mid] === target) {
      break;
    } else if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return steps;
}