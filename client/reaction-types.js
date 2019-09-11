module.exports = {
  creation: {
    reactants: [],
    products: [ { ratio: 1 } ],
    latex: '\\emptyset \\rightarrow A',
    label: 'O -> A'
  },
  destruction: {
    reactants: [ { ratio: 1 } ],
    products: [],
    latex: 'A -> \\emptyset',
    label: 'A -> O'
  },
  change: {
    reactants: [ { ratio: 1 } ],
    products: [ { ratio: 1 } ],
    label: 'A -> B'
  },
  dimerization: {
    reactants: [ { ratio: 2 } ],
    products: [ { ratio: 1 } ],
    label: '2A -> B'
  },
  merge: {
    reactants: [ { ratio: 1 }, { ratio: 1 } ],
    products: [ { ratio: 1 } ],
    label: 'A + B -> C'
  },
  split: {
    reactants: [ { ratio: 1 } ],
    products: [ { ratio: 1 }, { ratio: 1 } ],
    label: 'A -> B + C'
  },
  four: {
    reactants: [ { ratio: 1 }, { ratio: 1 } ],
    products: [ { ratio: 1 }, { ratio: 1 } ],
    label: 'A + B -> C + D'
  },
  'custom-massaction': {
    reactants: [ { ratio: 1 } ],
    products: [ { ratio: 1 } ],
    label: 'Custom mass action'
  },
  'custom-propensity': {
    reactants: [ { ratio: 1 } ],
    products: [ { ratio: 1 } ],
    label: 'Custom propensity'
  }
}
