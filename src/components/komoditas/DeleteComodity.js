import { Modal, Button} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteComodity, getLoading } from "../../store/komoditas";

function DeleteComodity({ title, modalOpen, setDeleteOpen, currentComodity }) {
  const loading = useSelector(getLoading);
  const dispatch = useDispatch();

  const handleCancel = () => {
    setDeleteOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteComodity(currentComodity))
      .then(() => {
        setDeleteOpen(false);
      })
      .catch(err => {
        console.error("Error: ", err);
      });
  };

  return (
    <Modal
      title={title}
      open={modalOpen}
      destroyOnClose={true}
      maskClosable={false}
      onOk={handleDelete}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
        <Button key="submit" type="primary" htmlType="submit" loading={loading} onClick={e => handleDelete(e)}>Hapus</Button>
      ]}
    >
      <div><span>Komoditas&nbsp;</span><span>{currentComodity?.komoditas}</span><span>&nbsp;akan dihapus?</span></div>
    </Modal>
  );
}

export default DeleteComodity;