import React from 'react';

const Changer = ({classes, update, children}) => (
  <button className={classes} onClick={update}>{children}</button>
);

export default Changer;