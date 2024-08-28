import React from 'react';

const UserProfile = ({ user }) => {
  if (!user) {
    return <p>Kein Benutzerprofil verfügbar.</p>;
  }

  return (
    <div>
      <h4 className="text-lg font-semibold">Profilinformationen:</h4>
      <p>Email: {user.email}</p>
      <p>Adresse: {user.address}</p>
      <p>Telefon: {user.phone}</p>
    </div>
  );
};

export default UserProfile;