import React, { useState } from 'react';
import InviteMember from './InviteMember';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';

function InviteButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInvite = (email: string) => {
    console.log(`초대 요청: ${email}`);
    alert(`${email} 님을 초대했습니다.`);
  };

  return (
    <div>
      <FontAwesomeIcon
        icon={faShareNodes}
        onClick={() => setIsModalOpen(true)}
        style={{ color: '#337aff' }}
      />
      <InviteMember
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // onInvite={handleInvite}
        // spaceId={space_id}
      />
    </div>
  );
}

export default InviteButton;
