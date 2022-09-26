import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin, Table, Input, Dropdown, Menu, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { titleChanged } from "../../store/header";
import { getComodities, getLoading, fetchComodities} from "../../store/komoditas";
import KomoditasModal from "./KomoditasModal";
import DeleteComodity from "./DeleteComodity";

const emptyComodity = {
  uuid: "",
  area_kota: "",
  area_provinsi: "",
  komoditas: "",
  price: "",
  size: "",
  tgl_parsed: "",
  timestamp: "",
}

const sortKomoditas = (a, b) => {
  const nameA = a.komoditas.toUpperCase();
  const nameB = b.komoditas.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  return 0;
};

const sortKota = (a, b) => {
  const nameA = a.area_kota.toUpperCase();
  const nameB = b.area_kota.toUpperCase();
  if (nameA < nameB) {
    return 1;
  }
  if (nameA > nameB) {
    return -1;
  }

  return 0;
};

const sortProvinsi = (a, b) => {
  const nameA = a.area_provinsi.toUpperCase();
  const nameB = b.area_provinsi.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  return 0;
};

function Komoditas() {
  const [comoditiesFiltered, setComoditiesFiltered] = useState(null);
  const [comoditySearch, setComoditySearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentComodity, setCurrentComodity] = useState(null);
  const comodities = useSelector(getComodities);
  const loading = useSelector(getLoading);
  const dispatch = useDispatch();
  const { Search } = Input;

  const columns = [
    {
      index: 0,
      title: "Komoditas",
      dataIndex: "komoditas",
      sorter: sortKomoditas,
    },
    {
      index: 1,
      title: "Kota",
      dataIndex: "area_kota",
      sorter: sortKota,
      filters: [
        {
          text: "PURWOREJO",
          value: "PURWOREJO",
        },
        {
          text: "ACEH KOTA",
          value: "ACEH KOTA",
        },
      ],
      onFilter: (value, record) => record.area_kota.trim().indexOf(value) === 0,
    },
    {
      index: 2,
      title: "Provinsi",
      dataIndex: "area_provinsi",
      sorter: sortProvinsi,
    },
    {
      index: 3,
      title: "Ukuran",
      dataIndex: "size",
      sorter: (a, b) => a.size - b.size,
      filters: [
        {
          text: "60",
          value: "60",
        },
        {
          text: "70",
          value: "70",
        },
        {
          text: "100",
          value: "100",
        },
      ],
      onFilter: (value, record) => record.size.trim().indexOf(value) === 0,
    },
    {
      index: 4,
      title: "Harga",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      index: 5,
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown overlay={menu(record)} trigger={['click']}>
          <span>
            <Space style={{ cursor: "pointer"}}>
              ...
            </Space>
          </span>
        </Dropdown>
      ),
    },
  ];
  
  const menu = (record) => (
    <Menu
      onClick={e => onClickAction(e, record)}
      items={[
        {
          label: 'Edit',
          key: '1',
        },
        {
          type: 'divider',
        },
        {
          label: 'Hapus',
          key: '3',
        },
      ]}
    />
  );

  useEffect(() => {
    dispatch(titleChanged("Komoditas"));
    dispatch(fetchComodities());
  }, [dispatch]);

  useEffect(() => {
    if (comoditySearch) {
      const filtered = comodities.filter(item => (
        item.uuid &&
        item.komoditas.trim().toLowerCase().includes(comoditySearch.trim()) 
      ));
      setComoditiesFiltered(filtered);
    } else {
      const notNull = comodities.filter(item => item.uuid);
      setComoditiesFiltered(notNull);
    }
  }, [comodities, comoditySearch])

  const onTableChange = (pagination, filters, sorter, extra) => {
    console.log("params: ", pagination, filters, sorter, extra);
  }

  const onSearchKomoditas = (value) => {
    setComoditySearch(value);
  };

  const onAddComodity = () => {
    setCurrentComodity(emptyComodity);
    setModalOpen(true);
  }

  const onClickAction = (e, record) => {
    if (e.key === "1") {
      setCurrentComodity(record);
      setModalOpen(true);
    } 

    if (e.key === "3") {
      setCurrentComodity(record);
      setDeleteOpen(true);
    }
  };

  return (
    <div
      className="content-layout-container"
    >
      {/* {loading && 
        <Spin className="loading-container" />
      } */}
      {/* {!loading &&  */}
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Search placeholder="Cari Komoditas" onSearch={onSearchKomoditas} allowClear style={{ width: 200 }} />
            </div>
            <div>
              <Button type="primary" onClick={onAddComodity}>
                <PlusOutlined />
                Tambah Komoditas
              </Button>
            </div>
          </div>
          <div className="table-box">
            <Table 
              columns={columns} 
              dataSource={comoditiesFiltered}
              onChange={onTableChange} 
              pagination={false} 
              loading={loading}
              rowKey="uuid" 
              scroll={{ x: 568 }}
            />
          </div>
          <KomoditasModal title="Tambah Komoditas" modalOpen={modalOpen} setModalOpen={setModalOpen} currentComodity={currentComodity} />
          <DeleteComodity title="Hapus Komoditas" modalOpen={deleteOpen} setDeleteOpen={setDeleteOpen} currentComodity={currentComodity} />
        </>
      {/* } */}
    </div>
  )
}

export default Komoditas;