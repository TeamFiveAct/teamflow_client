import React from 'react';
import Avatar from 'boring-avatars';

const avatarNames: string[] = [
  'Mary Roebling',
  'Amelia Earhart',
  'Maya Angelou',
  'Harriet Tubman',
  'Katharine Lee',
  'Willa Cather',
];

export default function ProfileImg() {
  const randomName =
    avatarNames[Math.floor(Math.random() * avatarNames.length)];

  return (
    <Avatar
      name={randomName}
      colors={['#0db2ac', '#f5dd7e', '#fc8d4d', '#fc694d', '#faba32']}
      variant="beam"
      size={80}
    />
  );
}
