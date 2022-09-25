import { Modal, Input } from "antd";

function KomoditasModal({ title, modalOpen, setModalOpen, editComodity }) {
  const handleSave = () => {
    setModalOpen(false);
  }

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <Modal
      title={title}
      open={modalOpen}
      onOk={handleSave}
      onCancel={handleCancel}
    >
      <p>{`${editComodity ? "Edit" : "Add"}`} modal</p>
      
    </Modal>
  );
}

export default KomoditasModal;