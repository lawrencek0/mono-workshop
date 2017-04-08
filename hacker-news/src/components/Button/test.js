import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import Button from '../Button';

describe('Button', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button>Give me more</Button>, div);
  });

  test('snapshots', () => {
    const component = renderer.create(
      <Button>Give me more</Button>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
});