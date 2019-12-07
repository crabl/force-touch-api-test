import * as Pressure from 'pressure';
import Draggable from 'draggable';

const data = {
  1: {
    forces: [],
    classification: null
  },
  2: {
    forces: [],
    classification: null
  },
  3: {
    forces: [],
    classification: null
  },
  4: {
    forces: [],
    classification: null
  },
  5: {
    forces: [],
    classification: null
  },
  6: {
    forces: [],
    classification: null
  },
  7: {
    forces: [],
    classification: null
  }
};

// classification constants
const LEFT = 'L';
const RIGHT = 'R';

// configuration
const config = {
  showCurrentForce: false
};

const showForceCheckbox: HTMLInputElement = document.querySelector('.config-show-force');
showForceCheckbox.checked = config.showCurrentForce;
showForceCheckbox.onchange = function() {
  config.showCurrentForce = !config.showCurrentForce;
  showForceCheckbox.checked = config.showCurrentForce;
};


// coordinates of drop zone rectangles
const dropZoneLeftRect = document.querySelector('.drop-zone-left').getBoundingClientRect();
const dropZoneRightRect = document.querySelector('.drop-zone-right').getBoundingClientRect();

function rectanglesDoIntersect(r1: ClientRect, r2: ClientRect) {
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

function plotForceValuesOnCanvas(canvas: HTMLCanvasElement, forces: number[]) {
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, 100, 100);
  const tick = 100 / (forces.length || 1);

  context.beginPath();
  context.moveTo(0, 100);
  
  for (let i = 0; i < forces.length; i++) {
    context.lineTo(i * tick, 100 - forces[i]);
  }

  context.stroke();
}

function showForceValueOnCanvas(canvas: HTMLCanvasElement, force: number) {
  const context = canvas.getContext('2d');
  context.clearRect(0,0,100,100);
  context.font = '30px Arial'
  context.fillText(force.toString(), 30, 50);
}

// make all elements with the 'draggable' class draggable
const draggables = document.querySelectorAll('.draggable');
for (let element of draggables) {
  new Draggable(element, {
    onDragEnd: function (element) {
      // get id and client rect of element
      const id = element.dataset.id;
      const elementRect = element.getBoundingClientRect();

      // determine if element intersects with either class & set classification
      if (rectanglesDoIntersect(elementRect, dropZoneLeftRect)) {
        data[id].classification = LEFT;
      } else if (rectanglesDoIntersect(elementRect, dropZoneRightRect)) {
        data[id].classification = RIGHT;
      } else {
        data[id].classification = null; // didn't land in either rect
      }

      // plot force values over time on element's canvas
      const canvas: HTMLCanvasElement = element.querySelector('canvas');
      const forces = data[id].forces;
      plotForceValuesOnCanvas(canvas, forces);
    }
  });
}

// the sauce
Pressure.set('.draggable', {
  start: function () {
    const id = this.dataset.id;
    data[id].forces = [];
  },
  change: function (force: number) {
    // get the 'data-id' parameter of the element we are dragging
    const id = this.dataset.id;

    // get the current force factor and append it to the  
    // 'forces' array on the object inside the data array
    const currentForce = +(force * 100).toFixed(0); // convert to number & scale between 0-100
    const currentObj = data[id];

    currentObj.forces.push(currentForce);

    // show the current force on the div
    if (config.showCurrentForce) {
      const canvas: HTMLCanvasElement = this.querySelector('canvas');
      showForceValueOnCanvas(canvas, currentForce);
    }
  }
}, {
  polyfill: false // only run on devices with 3d touch or force touch trackpads
});

function getData() {
  console.log(data);
  return data;
}

window['getData'] = getData;