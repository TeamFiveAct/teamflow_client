import React from 'react';
import Avatar from 'boring-avatars';

interface UserAvatarProps {
  name: string;
  size?: number;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, size = 40 }) => {
  return (
    <Avatar
      name={name || 'Default Avatar'}
      variant="beam"
      size={size}
      colors={['#0db2ac', '#f5dd7e', '#fc8d4d', '#fc694d', '#faba32']}
    />
  );
};

export default UserAvatar;
