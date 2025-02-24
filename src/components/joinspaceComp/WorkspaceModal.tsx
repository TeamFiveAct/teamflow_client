// // components/Workspace.tsx

// import React, { useState } from 'react';
// import '../../style/workspace.scss';

// interface WorkspaceModalProps {
//   onClose: () => void;
// }

// const WorkspaceModal: React.FC<WorkspaceModalProps> = ({ onClose }) => {
//   const [workspaceName, setWorkspaceName] = useState('');

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h3>새 워크스페이스 생성</h3>
//         <input
//           type="text"
//           placeholder="워크스페이스 이름 입력"
//           value={workspaceName}
//           onChange={e => setWorkspaceName(e.target.value)}
//         />
//         <div className="modal-actions">
//           <button className="modal-btn" onClick={onClose}>
//             취소
//           </button>
//           <button className="modal-btn confirm">생성</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WorkspaceModal;
