import React from 'react'
import { UserDataProvider } from './Context/UserDataContext';
import UserContainer from './UserContainer';

const UserIndex = () => {


  return (
    <>
      <UserDataProvider>
        <UserContainer />
      </UserDataProvider>
    </>
  );
};

export default UserIndex;