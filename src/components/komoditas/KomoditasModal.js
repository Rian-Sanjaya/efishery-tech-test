import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { addComodity, editComodity, getLoading } from "../../store/komoditas";
import { getAreas, fetchAreas } from "../../store/area";
import { getSizes, fetchSizes } from "../../store/size";
import { Modal, Input, InputNumber, Select,  Button} from "antd";

const sortArea = (a, b) => {
  const nameA = a.city.trim().toUpperCase();
  const nameB = b.city.trim().toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  return 0;
};

const sortSizes = (a, b) => {
  const nameA = a.size.trim().toUpperCase();
  const nameB = b.size.trim().toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  return 0;
};

function KomoditasModal({ title, modalOpen, setModalOpen, currentComodity }) {
  const [areasSorted, setAreasSorted] = useState(null);
  const [province, setProvince] = useState("");
  const [sizesSorted, setSizesSorted] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const areas = useSelector(getAreas);
  const loading = useSelector(getLoading);
  const sizes = useSelector(getSizes);
  const dispatch = useDispatch();
  const { register, trigger, watch, setValue, reset, formState: { errors } } = useForm();
  const { Option } = Select;

  useEffect(() => {
    dispatch(fetchAreas());
    dispatch(fetchSizes());
  }, [dispatch])

  useEffect(() => {
    if (areas && areas.length > 0) {
      const filtered = areas.filter(area => area.city)
      // console.log(filtered)
      const sorted = filtered.sort(sortArea);
      // const sorted = filtered;
      setAreasSorted(sorted);
    }

    if (sizes && sizes.length > 0) {
      // const sorted = sizes.sort(sortSizes);
      // setSizesSorted(sorted);
      setSizesSorted(sizes);
    }
  }, [areas, sizes])

  useEffect(() => {
    // console.log("currentComodity: ", currentComodity);
    if(currentComodity?.uuid) {
      // reset({
      //   comodity: currentComodity.komoditas
      // });
      // console.log(watch("comodity"))
      setValue("comodity", currentComodity.komoditas, { shouldDirty: true });
      // console.log(watch("comodity"))
      const area = areasSorted?.find(area => area.city.trim() === currentComodity.area_kota.trim());
      setValue("city", currentComodity.area_kota);
      setProvince(area?.province);
      setValue("size", currentComodity.size);
      setValue("price", currentComodity.price);
      // trigger();
    } else {
      reset();
    }
  }, [currentComodity, areasSorted, setValue, trigger, reset, watch])

  const handleCancel = () => {
    setModalOpen(false);
  };

  // const onSubmit = data => {
  //   console.log("data: ", data)
  //   setModalOpen(false);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await trigger();
    if (
      Object.keys(errors).length > 0 || 
      !watch("comodity") || 
      !watch("city") ||
      !watch("size") || 
      !watch("price")
    ) {
      return;
    }

    const comodity = {
      uuid: currentComodity?.uuid ? currentComodity.uuid : uuidv4(),
      komoditas: watch("comodity"),
      area_kota: watch("city"),
      area_provinsi: province,
      size: watch("size"),
      price: watch("price").replace(/[,.]/g, ""),
      tgl_parsed: currentComodity?.uuid ? currentComodity.tgl_parsed : new Date().toISOString(),
      timestamp: Date.now().toString(),
    }

    if (currentComodity?.uuid) {
      dispatch(editComodity(comodity))
        .then(() => {
          setModalOpen(false);
        })
        .catch(err => {
          console.error("Error: ", err);
        })
    } else {
      dispatch(addComodity([comodity]))
        .then(() => {
          setModalOpen(false);
        })
        .catch(err => {
          console.error("Error: ", err);
        })
    }
  }
  
  // const onErrors = errors => console.log("Errors: ", errors);

  const onInputChange = async (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    
    setValue(name, value.toUpperCase());
    const result = await trigger("comodity");
    // console.log(result)
    setIsValid(result)
    // console.log("comodity: ", errors.comodity)
    // console.log(errors)
  };

  const onAreaChange = async (value) => {
    const area = areasSorted.find(area => area.city.trim() === value.trim());
    setValue("city", value);
    setProvince(area.province);
    // setValue("province", area.province);
    const result = await trigger("city");
    // console.log(watch("province"))
    setIsValid(result);
  };

  const onSizeChange = async (value) => {
    setValue("size", value);
    const result = await trigger("size");
    // console.log(result)
    setIsValid(result)
  };

  const onPriceChange = async (value) => {
    setValue("price", value);
    const result = await trigger("price");
    // console.log(result)
    setIsValid(result)
  };

  return (
    <Modal
      title={title}
      open={modalOpen}
      destroyOnClose={true}
      maskClosable={false}
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>Cancel</Button>,
        <Button key="submit" type="primary" htmlType="submit" loading={loading} onClick={e => handleSubmit(e)}>Save</Button>
        // <Button key="submit" type="primary" htmlType="submit" onSubmit={e => handleSubmit(e)}>Save</Button>
        // <button type="submit" onClick={{onSubmit}}>Save</button>
        // <input type="submit" />
      ]}
    >
      {/* <form className="form-box" onSubmit={handleSubmit(onSubmit, onErrors)}> */}
      <form className="form-box" onSubmit={handleSubmit}>
        <div>
          <div className="input-label">Komoditas</div>
          <Input 
            placeholder="Contoh: Nila" 
            allowClear
            name="comodity" 
            style={{ textTransform: "uppercase" }}
            {...register("comodity", {
              required: true,
            })}
            value={watch("comodity")}
            onChange={e => onInputChange(e)}
          />
          {/* <input 
            placeholder="Contoh: Nila" 
            name="comodity" 
            onChange={e => onInputChange(e)}
          /> */}
          {errors.comodity && <span className="invalid-input">Komoditas harus diisi</span>}
        </div>
        <div>
          <div className="input-label">Kota</div>
          <Select 
            placeholder="Pilih Kota"
            style={{ width: "100%" }} 
            name="city"
            {...register("city", {
              required: true,
            })}
            value={watch("city")}
            onChange={onAreaChange}
          >
            {areasSorted && areasSorted.length > 0 && areasSorted.map((area, i) => (
              <Option key={i} value={area.city}>{area.city}</Option>
            ))}
          </Select>
          {errors.city && <span className="invalid-input">Kota harus diisi</span>}
        </div>
        <div>
          <div className="input-label">Provinsi</div>
          <Input 
            placeholder="Provinsi"
            disabled
            name="province"
            // {...register("province", {
            //   required: true,
            // })}
            value={province}
          />
          {/* <input 
            placeholder="Provinsi"
            disabled
            name="province"
            // {...register("province", {
            //   required: true,
            // })}
            value={province}
          /> */}
        </div>
        <div>
          <div className="input-label">Ukuran</div>
          <Select 
            placeholder="Pilih Ukuran"
            style={{ width: "100%" }} 
            name="size"
            {...register("size", {
              required: true,
            })}
            value={watch("size")}
            onChange={onSizeChange}
          >
            {sizesSorted && sizesSorted.length > 0 && sizesSorted.map((size, i) => (
              <Option key={i} value={size.size}>{size.size}</Option>
            ))}
          </Select>
          {errors.size && <span className="invalid-input">Ukuran harus diisi</span>}
        </div>
        <div>
          <div className="input-label">Harga</div>
          <InputNumber
            name="price" 
            min={1}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            style={{ width: "100%" }}
            {...register("price", {
              required: true,
            })}
            value={watch("price")}
            onChange={onPriceChange}
          />
          {errors.price && <span className="invalid-input">Ukuran harus diisi</span>}
        </div>
      </form>
    </Modal>
  );
}

export default KomoditasModal;