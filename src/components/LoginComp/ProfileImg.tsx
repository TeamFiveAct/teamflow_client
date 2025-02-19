// components/ProfileImg.tsx
import React, { useState } from 'react';
import Avatar from 'boring-avatars';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const avatarNames: string[] = [
  'Mary Roebling',
  'Amelia Earhart',
  'Maya Angelou',
  'Harriet Tubman',
  'Katharine Lee',
  'Willa Cather',
];

interface ProfileImgProps {
  onSelectAvatar: (name: string) => void;
}

export default function ProfileImg({ onSelectAvatar }: ProfileImgProps) {
  const [selectedName, setSelectedName] = useState(avatarNames[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (name: string) => {
    setSelectedName(name);
    setIsDropdownOpen(false);
    onSelectAvatar(name);
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center position-relative">
      <div className="avatar-wrapper d-flex flex-column align-items-center justify-content-center position-relative rounded-3">
        <button
          className="profileImgSelectBtn position-absolute border border-dark bg-white rounded-circle d-flex justify-content-center align-items-center"
          style={{ width: '25px', height: '25px', bottom: '0', right: '0' }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          type="button"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <Avatar
          name={selectedName}
          colors={['#0db2ac', '#f5dd7e', '#fc8d4d', '#fc694d', '#faba32']}
          variant="beam"
          size={80}
        />
      </div>
      {isDropdownOpen && (
        <div className="avatar-dropdown top-100 start-0 bg-white border border-light rounded-3 p-2 d-flex gap-2 justify-content-center shadow">
          {avatarNames.map(name => (
            <div
              key={name}
              className="avatar-option d-flex justify-content-center align-items-center cursor-pointer"
              onClick={() => handleSelect(name)}
            >
              <Avatar
                name={name}
                colors={['#0db2ac', '#f5dd7e', '#fc8d4d', '#fc694d', '#faba32']}
                variant="beam"
                size={40}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
