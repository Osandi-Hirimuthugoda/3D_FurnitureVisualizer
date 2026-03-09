// Templates stored locally for frontend use.
// Each template includes layout information that can be applied in the 2D editor.

export const templateLayouts = [
  // MODERN LIVING ROOM

  {
    id: 'modern-living-room-rectangle',
    name: 'Modern Living Room',
    shape: 'rectangle',
    furniture: [
      { type: 'sofa', position: [2, 0, 1], rotation: 0 },
      { type: 'coffeeTable', position: [3, 0, 2], rotation: 0 },
      { type: 'floorLamp', position: [1, 0, 3], rotation: 0 }
    ]
  },

  {
    id: 'modern-living-room-square',
    name: 'Modern Living Room',
    shape: 'square',
    furniture: [
      { type: 'sofa', position: [2, 0, 2], rotation: 0 },
      { type: 'coffeeTable', position: [3, 0, 3], rotation: 0 },
      { type: 'floorLamp', position: [1, 0, 4], rotation: 0 }
    ]
  },

  {
    id: 'modern-living-room-lshape',
    name: 'Modern Living Room',
    shape: 'l-shape',
    furniture: [
      { type: 'sofa', position: [2, 0, 1], rotation: 0 },
      { type: 'coffeeTable', position: [3, 0, 2], rotation: 0 },
      { type: 'floorLamp', position: [1, 0, 4], rotation: 0 }
    ]
  },

  {
    id: 'modern-living-room-ushape',
    name: 'Modern Living Room',
    shape: 'u-shape',
    furniture: [
      { type: 'sofa', position: [3, 0, 1], rotation: 0 },
      { type: 'coffeeTable', position: [7, 0, 3], rotation: 0 },
      { type: 'floorLamp', position: [1, 0, 4], rotation: 0 }
    ]
  },

  // MINIMALIST BEDROOM

  {
    id: 'minimalist-bedroom-rectangle',
    name: 'Minimalist Bedroom',
    shape: 'rectangle',
    furniture: [
      { type: 'bed', position: [2, 0, 2], rotation: 0 },
      { type: 'nightstand', position: [3, 0, 2], rotation: 0 },
      { type: 'wardrobe', position: [1, 0, 4], rotation: 90 }
    ]
  },

  {
    id: 'minimalist-bedroom-square',
    name: 'Minimalist Bedroom',
    shape: 'square',
    furniture: [
      { type: 'bed', position: [2, 0, 2], rotation: 0 },
      { type: 'nightstand', position: [3, 0, 2], rotation: 0 },
      { type: 'wardrobe', position: [1, 0, 4], rotation: 90 }
    ]
  },

  {
    id: 'minimalist-bedroom-lshape',
    name: 'Minimalist Bedroom',
    shape: 'l-shape',
    furniture: [
      { type: 'bed', position: [2, 0, 1], rotation: 0 },
      { type: 'nightstand', position: [3, 0, 1], rotation: 0 },
      { type: 'wardrobe', position: [4, 0, 4], rotation: 90 }
    ]
  },

  {
    id: 'minimalist-bedroom-ushape',
    name: 'Minimalist Bedroom',
    shape: 'u-shape',
    furniture: [
      { type: 'bed', position: [3, 0, 1], rotation: 0 },
      { type: 'nightstand', position: [5, 0, 1], rotation: 0 },
      { type: 'wardrobe', position: [1, 0, 4], rotation: 90 }
    ]
  },

  // OFFICE WORKSPACE

  {
    id: 'office-workspace-rectangle',
    name: 'Office Workspace',
    shape: 'rectangle',
    furniture: [
      { type: 'desk', position: [2, 0, 1], rotation: 0 },
      { type: 'officeChair', position: [2, 0, 2], rotation: 180 },
      { type: 'bookshelf', position: [1, 0, 4], rotation: 0 }
    ]
  },

  {
    id: 'office-workspace-square',
    name: 'Office Workspace',
    shape: 'square',
    furniture: [
      { type: 'desk', position: [2, 0, 2], rotation: 0 },
      { type: 'officeChair', position: [2, 0, 3], rotation: 180 },
      { type: 'bookshelf', position: [4, 0, 1], rotation: 90 }
    ]
  },

  {
    id: 'office-workspace-lshape',
    name: 'Office Workspace',
    shape: 'l-shape',
    furniture: [
      { type: 'desk', position: [2, 0, 1], rotation: 0 },
      { type: 'officeChair', position: [2, 0, 2], rotation: 180 },
      { type: 'bookshelf', position: [4, 0, 4], rotation: 90 }
    ]
  },

  {
    id: 'office-workspace-ushape',
    name: 'Office Workspace',
    shape: 'u-shape',
    furniture: [
      { type: 'desk', position: [3, 0, 1], rotation: 0 },
      { type: 'officeChair', position: [3, 0, 2], rotation: 180 },
      { type: 'bookshelf', position: [1, 0, 4], rotation: 90 }
    ]
  },

  // STUDIO APARTMENT

  {
    id: 'studio-apartment-rectangle',
    name: 'Studio Apartment Layout',
    shape: 'rectangle',
    furniture: [
      { type: 'bed', position: [1, 0, 3], rotation: 0 },
      { type: 'sofa', position: [4, 0, 1], rotation: 0 },
      { type: 'diningTable', position: [3, 0, 3], rotation: 0 }
    ]
  },

  {
    id: 'studio-apartment-square',
    name: 'Studio Apartment Layout',
    shape: 'square',
    furniture: [
      { type: 'bed', position: [1, 0, 3], rotation: 0 },
      { type: 'sofa', position: [3, 0, 1], rotation: 0 },
      { type: 'diningTable', position: [3, 0, 3], rotation: 0 }
    ]
  },

  {
    id: 'studio-apartment-lshape',
    name: 'Studio Apartment Layout',
    shape: 'l-shape',
    furniture: [
      { type: 'bed', position: [1, 0, 3], rotation: 0 },
      { type: 'sofa', position: [4, 0, 1], rotation: 0 },
      { type: 'diningTable', position: [4, 0, 4], rotation: 0 }
    ]
  },

  {
    id: 'studio-apartment-ushape',
    name: 'Studio Apartment Layout',
    shape: 'u-shape',
    furniture: [
      { type: 'bed', position: [1, 0, 4], rotation: 0 },
      { type: 'sofa', position: [4, 0, 1], rotation: 0 },
      { type: 'diningTable', position: [7, 0, 3], rotation: 0 }
    ]
  }

];