import React from 'react';

type AuthGateProps = {
  loggedIn: boolean;
  children: React.ReactNode;
  authUI: React.ReactNode;
};

const AuthGate: React.FC<AuthGateProps> = ({ loggedIn, children, authUI }) => {
  if (loggedIn) {
    return <>{children}</>;
  }
  return <>{authUI}</>;
};

export default AuthGate;