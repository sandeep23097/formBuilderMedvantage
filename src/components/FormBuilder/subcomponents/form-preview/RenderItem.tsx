import React, { FC, useState, useEffect } from 'react'
import { FormLayoutComponentChildrenType } from '../../../../types/FormTemplateTypes';
import { FormControlNames } from '../../../../utils/formBuilderUtils';
import { Checkbox, FormControl, FormControlLabel, FormGroup, MenuItem, Radio, RadioGroup, Select, Switch, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const dateFormat = 'yyyy, MMM dd';


interface RenderItemProps{
  item: FormLayoutComponentChildrenType,
  handleInputChange: (id?: string,value?: string) => void;
}

const RenderItem: FC<RenderItemProps> = (props)=> {
  const { item,handleInputChange  } = props;
  const [selectItems, setSelectItems] = useState([]);
  const id = item?.apiItemsDetails?.id?.split('.')[1] || "";
  const value = item?.apiItemsDetails?.value?.split('.')[1] || "";
  const label = item?.apiItemsDetails?.label?.split('.')[1] || "";
  const [selectedDropDownValue, setSelectedDropDownValue] = useState('');
  // const { id, value, label } = item.apiItemsDetails || {};
  const handleDropDownChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    const val = event.target.value;
    
    handleInputChange(item.labelName, val);
    setSelectedDropDownValue(val);
    // item.selectedValue = event.target.value
};
console.log("%%%%%%%%%%%%%%%%",id);
  useEffect(() => {
    if (item.apiItemsDetails) {
      var data1 = {
        "schemaName": item.apiItemsDetails.schemaName,
      "sqlStateMent": item.apiItemsDetails.fullQuery,
      }
      const fetchData = async () => {
        try {
          const response = await fetch('http://172.16.61.31:7105/api/DynamicQuery/ExecuteQuery', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data1)
          }); // API URL from item.apiItemsDetails
          const data = await response.json();
          setSelectItems(data.responseValue); // assuming your API returns an array of items
        } catch (error) {
          console.error('Failed to fetch items', error);
        }
      };

      fetchData();
    } else {
      setSelectItems(item.items); // Use static items if apiItemsDetails is null
    }
  }, [item.apiItemsDetails, item.items]); 

  switch (item.controlName) {
    case FormControlNames.INPUTTEXTFIELD:
      return (
        <>
          <TextField
            type={item.dataType}
            fullWidth={true}
            placeholder={item.placeholder}
            variant="outlined"
            onChange={(e) => handleInputChange(item.labelName, e.target.value)}
          />
        </>
      );

    case FormControlNames.INPUTMULTILINE:
      return (
        <>
          <TextField
            type={item.dataType}
            fullWidth={true}
            multiline={true}
            minRows={item.rows}
            placeholder={item.placeholder}
            variant="outlined"
            onChange={(e) => handleInputChange(item.id, e.target.value)}
          />
        </>
      );
    case FormControlNames.CHECKBOX:
      return (
        <>
          <div className="m-t-20 p-l-0">
            <FormControlLabel
              control={
                <Checkbox
                />
              }
              style={{ marginLeft: "0px" }}
              label={item.placeholder}
            />
          </div>
        </>
      );

    case FormControlNames.RADIOGROUP:
      return (
        <>
          <FormControl>
            {/* <FormLabel>{item.labelName + (item.required?" *":"")}</FormLabel> */}
            <RadioGroup name={item.controlName + item.id} row>
              {item.items?.map((i) => (
                <FormControlLabel
                  value={i.value}
                  key={i.value}
                  control={<Radio />}
                  label={i.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </>
      );

    case FormControlNames.SELECTDROPDOWN:
      return (
        <>
        <FormControl style={{ minWidth: "100%" }}>
          <Select
            variant="outlined"
            value={selectedDropDownValue}
            onChange={handleDropDownChange}
          >
            {Array.isArray(selectItems) ? (
              selectItems.map((i) => (
                <MenuItem key={i[id]} value={i[id]}>
                  {i[label]}
                </MenuItem>
              ))
            ) : (
              item.items?.map((i, ind) => (
                <MenuItem key={i.value} value={i.id}>
                  {i.label}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </>
      
      );

    case FormControlNames.DATEFIELD:
      return (
        <>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </>
      );

    case FormControlNames.TIMEFIELD:
      return (
        <>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <TimePicker
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </>
      );

    case FormControlNames.FILEUPLOAD:
      return (
        <>
          <input style={{ display: "none" }} id={item.controlName + item.id} type="file" />
          <label className="control-input-trigger-buttons" htmlFor={item.controlName + item.id}>
            <i className="fas fa-cloud-upload-alt"></i>
          </label>
        </>
      );

    case FormControlNames.IMAGEUPLOAD:
      return (
        <>
          <input style={{ display: "none" }} id={item.controlName + item.id} type="file" />
          <label className="control-input-trigger-buttons" htmlFor={item.controlName + item.id}>
            <i className="far fa-image"></i>
          </label>
        </>
      );

    case FormControlNames.SCANCODE:
      return (
        <>
          <input style={{ display: "none" }} id={item.controlName + item.id} type="file" />
          <label className="control-input-trigger-buttons" htmlFor={item.controlName + item.id}>
            <i className="fas fa-qrcode"></i>
          </label>
        </>
      );

    case FormControlNames.SCANCODE:
      return (
        <>
          <input style={{ display: "none" }} id={item.controlName + item.id} type="file" />
          <label className="control-input-trigger-buttons" htmlFor={item.controlName + item.id}>
            <i className="fas fa-qrcode"></i>
          </label>
        </>
      );

    case FormControlNames.SIGNATURE:
      return (
        <>
          <label
            className="control-input-trigger-buttons"
            style={{ width: "270px" }}
            htmlFor={item.controlName + item.id}
          >
            <span className="sign-label">Sign Here</span>
          </label>
        </>
      );

    case FormControlNames.TOGGLE:
      return (
        <>
          <Switch checked={true} />
        </>
      );


      


    case FormControlNames.CHECKLIST:
      return (
        <>
        {Array.isArray(selectItems) ? (
          selectItems.map((i) => (
            <FormControlLabel
              key={i[id]}
              control={<Checkbox />}
              label={i[label]} // Changed from i[value] to i[label] for the label
              style={{ marginLeft: "0px" }}
            />
          ))
        ) : (
          <FormGroup>
            {item.items?.map((i, ind) => (
              <FormControlLabel
                key={i.value}
                control={<Checkbox />}
                label={i.label}
                style={{ marginLeft: "0px" }}
              />
            ))}
          </FormGroup>
        )}
      </>
      );
  }
  return <></>
}

export default RenderItem;