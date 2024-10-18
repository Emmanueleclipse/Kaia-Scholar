// ModalComponent.tsx
import React, { ReactNode } from "react";
import Modal from "react-modal";

interface ModalProps {
  isOpen: boolean;
  afterOpenModal?: () => void;
  onRequestClose?: () => void;
  children?: any;
  modalTop?: boolean;
  shouldCloseOnEsc?:boolean;
  shouldCloseOnOverlayClick?:boolean;
}

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     backgroundColor: "transparent",
//     border: "none",
//   },
//   overlay: {
//     background: 'rgba(255, 255, 255, 0.85)',
//   }
// };

const ModalBox: React.FC<ModalProps> = ({
  isOpen,
  afterOpenModal,
  onRequestClose,
  children,
  modalTop,
  shouldCloseOnEsc=true,
  shouldCloseOnOverlayClick=true,
}) => {
    const customStyles = {
        close:{ display: "none" },
        content: {
          top: modalTop?"30%":"50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "transparent",
          border: "none",
        },
        overlay: {
          background: 'rgba(255, 255, 255, 0.85)',
        }
      };
  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={onRequestClose}
      style={customStyles}
      portalClassName={"bg-red-700"}
      shouldCloseOnEsc={shouldCloseOnEsc}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
    >
      {children}
    </Modal>
  );
};

export default ModalBox;
