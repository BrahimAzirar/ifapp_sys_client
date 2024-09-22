import React from 'react';

function AuthAlert({ message }) {
  return (
    <p className='AuthAlert'>{ message }</p>
  );
};

export default React.memo(AuthAlert);