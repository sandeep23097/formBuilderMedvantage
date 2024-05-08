import React, { FC, useEffect, useState } from 'react'
import ManageItemsListComponent from './ManageItemsListComponent';
import { FormLayoutComponentChildrenType, FormLayoutComponentContainerType, FormLayoutCoponentChildrenItemsType } from '../../../types/FormTemplateTypes';
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField } from '@mui/material';
import { FormControlNames, FormItemTypes } from '../../../utils/formBuilderUtils';
import { FormLayoutComponentsType } from '../../../types/FormTemplateTypes';
import _ from "lodash";
import useModalStrip from '../../../global-hooks/useModalStrip';
import QueryBuilderModalComponent from '../QueryBuilderModal';

// const textboxStyle={
//   minWidth: "100%",
//   maxWidth: "100%",
//   marginTop: 10,
// }

interface EditPropertiesComponentProps{
  selectedControl?:
    | undefined
    | FormLayoutComponentChildrenType
    | FormLayoutComponentContainerType;
  selectControl?: (layout: FormLayoutComponentChildrenType | FormLayoutComponentContainerType | undefined) => void;
  editControlProperties: (updatedItem: FormLayoutComponentChildrenType)=>void;
  editContainerProperties: (updatedItem: FormLayoutComponentContainerType)=>void;
  formLayoutComponents: FormLayoutComponentsType[];
  moveControlFromSide: (selectedControl: FormLayoutComponentChildrenType, moveControlObj: FormLayoutComponentChildrenType)=>void;
}

const EditPropertiesComponent: FC<EditPropertiesComponentProps> = (props)=> {
  
  const {selectedControl, selectControl, editControlProperties, editContainerProperties} = props;
  const [updatedItem, setUpdatedItem] = useState<FormLayoutComponentChildrenType | FormLayoutComponentContainerType| {}>({});
  const [selectedListItemType, setSelectedListItemType] = useState('Static'); 
  const childUpdatedItem = updatedItem as FormLayoutComponentChildrenType;
  const containerUpdatedItem = updatedItem as FormLayoutComponentContainerType;
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isGotApiItemData, setIsGotApiItemData] = useState<boolean>(false);
  const [apiItemData, setApiItemData] = useState();
  const [isSetApiItemData, setisSetApiItemData] = useState(false);
  
  const [isUpdatedItemRequired, setIsUpdatedItemRequired] = useState(false);

  const [moveControlObj, setMoveControlObj] = useState<FormLayoutComponentChildrenType | null>(null);
  const [controlsInContainer, setControlsInContainer] = useState<number | undefined>(undefined);

  const {showModalStrip} = useModalStrip();

  useEffect(()=>{
console.log("RRRRRRRRRRRRR",apiItemData);
setIsGotApiItemData(true);
setOpenDialog(false);
  },[apiItemData]);
  useEffect(()=>{
    if(selectedControl){
      if((selectedControl as FormLayoutComponentChildrenType).items){
        setUpdatedItem({
          ...selectedControl,
          items: JSON.parse(
            JSON.stringify(
              (selectedControl as FormLayoutComponentChildrenType).items
            )
          ),
        });
      } else{
        setUpdatedItem({...selectedControl});
      }
      if(selectedControl.hasOwnProperty('required')){
        setIsUpdatedItemRequired(
          (selectedControl as FormLayoutComponentChildrenType).required
        );
      }
    }
    setMoveControlObj(null);
    setControlsInContainer(undefined);
  },[selectedControl])
  
  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>  = (e)=>{
    const { name, value } = e.target;
    setUpdatedItem((prevState) => ({
      ...prevState, [name]: value 
    }));
  }


  const addItemInList = (item:FormLayoutCoponentChildrenItemsType)=>{
    const newItems = _.cloneDeep((updatedItem as FormLayoutComponentChildrenType).items);
    newItems.push(item);
    setUpdatedItem((prevState)=>({
      ...prevState, items: newItems
    }));
  }

  const deleteItemFromList = (item: FormLayoutCoponentChildrenItemsType)=>{
    const newItems = (updatedItem as FormLayoutComponentChildrenType).items?.filter((i)=>i.id !== item.id);
    setUpdatedItem((prevState)=>({
      ...prevState, items: newItems
    }));
  }

  const editIteminList = (item: FormLayoutCoponentChildrenItemsType)=>{
    const newItems: FormLayoutCoponentChildrenItemsType[] = _.cloneDeep((updatedItem as FormLayoutComponentChildrenType).items);
    const itemToBeReplaced = newItems.filter((i)=>i.id === item.id)[0];
    itemToBeReplaced.value = item.value;
    itemToBeReplaced.label = item.label;
    setUpdatedItem((prevState)=>({
      ...prevState, items: newItems
    }));
  }

  const handleCheckChange: React.ChangeEventHandler<HTMLInputElement> = (e)=>{
    const { name, value } = e.target;
    const key = e.currentTarget.checked;
    if(name === 'required'){
      setIsUpdatedItemRequired(key);
    }
    setUpdatedItem((prevState) => ({
      ...prevState, [name]: key 
    }));
  }

  const onFormSubmit: React.FormEventHandler<HTMLFormElement> = (event)=>{
    event.preventDefault();
    if(selectedListItemType === 'Query')
      {
        console.log("**************",apiItemData);
        setUpdatedItem((prevState)=>({
          ...prevState, items: [],apiItemsDetails: apiItemData
        }));
        editControlProperties({
          ...updatedItem, // Pass the updatedItem state
          items: [], // Assuming this is the correct structure for editControlProperties
          apiItemsDetails: apiItemData // Pass the apiItemData
        } as FormLayoutComponentChildrenType);
      }
      else
      {
        editControlProperties(updatedItem as FormLayoutComponentChildrenType);
      }
  
  }

  const onContainerFormSubmit: React.FormEventHandler<HTMLFormElement> =(event)=>{
    event.preventDefault();
    if(selectedListItemType === 'Query')
      {
        console.log("**************",apiItemData);
        setUpdatedItem((prevState)=>({
          ...prevState, items: [],apiItemsDetails: apiItemData
        }));
      }
  
    editContainerProperties((updatedItem as FormLayoutComponentContainerType));
  }

  const handleMoveControlSelectChange: ((event: SelectChangeEvent<any>, child: React.ReactNode)=>void) = (e)=>{
    const {name,value}= e.target;

    if(name === 'containerId'){
      const container = props.formLayoutComponents.filter((con)=>con.container.id === value)[0];
      let stepsInContainer = container.children.length;
      if((selectedControl as FormLayoutComponentChildrenType).containerId === value){
        stepsInContainer -= 1;
      }
      
      setControlsInContainer(stepsInContainer);
    }
    setMoveControlObj((prev)=>({
      ...prev as FormLayoutComponentChildrenType,
      [name]:value
    }))
  }

  const getPositions = ()=>{
    if(controlsInContainer !== undefined){
      return Array.from(Array(controlsInContainer+1).keys()).map((item)=>{
        return <MenuItem key={item} value={item}>{item+1}</MenuItem>
      })
    }
    return null;
  }

  const onMoveControlFormSubmit: React.FormEventHandler<HTMLFormElement> = (e)=>{
    e.preventDefault();

    if(!(moveControlObj as FormLayoutComponentChildrenType).containerId){
      showModalStrip("danger","You need to select Step first",5000);
      return;
    }
    props.moveControlFromSide(selectedControl as FormLayoutComponentChildrenType,moveControlObj as FormLayoutComponentChildrenType);
  }

  const handleSelectedListItemTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedListItemType(event.target.value);
    if(event.target.value == 'Query')
      {
        setOpenDialog(true);
      }
      else
      {
        setOpenDialog(false);
      }
};
  return (
    <>
      {selectedControl ? (
        <>
          {containerUpdatedItem.itemType === FormItemTypes.CONTAINER ? (
            <>
              <div className="main-form">
                <form
                  onSubmit={onContainerFormSubmit}
                  style={{ minWidth: "100%" }}
                >
                  <div className="main-form-title">
                    Edit Container Properties
                  </div>
                  <div>
                    <TextField
                      label="Container Heading"
                      name="heading"
                      value={containerUpdatedItem.heading}
                      onChange={handleChange}
                      // style={textboxStyle}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Container Sub-Heading"
                      name="subHeading"
                      value={containerUpdatedItem.subHeading}
                      onChange={handleChange}
                      // style={textboxStyle}
                    />
                  </div>
                  <input
                    type="submit"
                    className="btn btn-light btn-shadow m-t-20 m-r-10"
                    value="Update Data"
                  />
                  <input
                    type="button"
                    className="btn btn-light btn-shadow m-t-20 m-l-0"
                    value="Cancel"
                    onClick={() => {
                      if (selectControl) {
                        selectControl(undefined);
                      }
                    }}
                  />
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="main-form">
                <form onSubmit={onFormSubmit} style={{ minWidth: "100%" }}>
                  <div className="main-form-title m-b-10">Edit Field Properties</div>
                  <div> <label htmlFor="" className='m-b-0'>Field Label Name</label> </div>
                  <div className='m-b-20'>
                    <TextField
                      // label="Field Label Name"
                      name="labelName"
                      value={childUpdatedItem.labelName}
                      onChange={handleChange}
                      // style={textboxStyle}
                      placeholder='Enter Field Label Name...'
                    />
                  </div>
                  {/* {childUpdatedItem.controlName === FormControlNames.INPUTTEXTFIELD ? <>
            <div>
              <FormControl style={{minWidth:'100%'}}>
                <InputLabel>Prefill Data With</InputLabel>
                <Select
                >
                  <MenuItem value={'ConsignmentId'}>Consignment Id</MenuItem>
                  <MenuItem value={'Weight'}>Weight</MenuItem>            
                </Select>
              </FormControl>
            </div>
          </>: null} */}
                  {childUpdatedItem.controlName ===
                    FormControlNames.INPUTTEXTFIELD ||
                  childUpdatedItem.controlName === FormControlNames.INPUTMULTILINE ||
                  childUpdatedItem.controlName === FormControlNames.CHECKBOX ? (
                    <>
                    <div> <label htmlFor="" className='m-b-0'>Field Placeholder</label> </div>
                      <div className='m-b-20'>
                        <TextField
                          // label="Field Placeholder"
                          name="placeholder"
                          value={childUpdatedItem.placeholder}
                          onChange={handleChange}
                          // style={textboxStyle}
                          placeholder='Enter Field Placeholder...'
                        />
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                   <div> <label htmlFor="" className='m-b-0'>Field Description</label> </div>
                  <div>
                    <TextField
                      // label="Field Description"
                      name="description"
                      value={childUpdatedItem.description}
                      onChange={handleChange}
                      multiline
                      // style={textboxStyle}
                      placeholder='Enter Field Description...'
                    />
                  </div>
                  <div className="m-t-20 p-l-0">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isUpdatedItemRequired}
                          name="required"
                          onChange={handleCheckChange}
                        />
                      }
                      label="Required"
                    />
                  </div>
                  {childUpdatedItem.controlName === FormControlNames.RADIOGROUP ||
                  childUpdatedItem.controlName === FormControlNames.SELECTDROPDOWN ||
                  childUpdatedItem.controlName === FormControlNames.CHECKLIST ? (
                    <>
                      <h6>List Items</h6>

                      <FormControl>
          <RadioGroup name={"ListItemType"} value = {selectedListItemType} onChange={handleSelectedListItemTypeChange} row>
           
              <FormControlLabel value={"Static"} key={"Static"} control={<Radio />} label={"Static Items"} />
              <FormControlLabel value={"Query"} key={"dynamic"} control={<Radio />} label={"From Query Items"} />
          
          </RadioGroup>
        </FormControl>
        {selectedListItemType === 'Static' && (
               <ManageItemsListComponent
               addItemInList={addItemInList}
               editIteminList={editIteminList}
               deleteItemFromList={deleteItemFromList}
               items={childUpdatedItem.items}
             />
            )}
        {selectedListItemType === 'Query' && (
  <>
    <QueryBuilderModalComponent
      openDialog={openDialog}
      setOpenDialog={setOpenDialog}
      setApiItemData={setApiItemData}
      setisSetApiItemData={setisSetApiItemData}
    />
    {isSetApiItemData && (<><h6>{apiItemData.queryTemplateName}</h6>
    <br />
    <span>
   id:  {apiItemData.id}
   </span>
   <br />
    <span>
   value:  {apiItemData.value}
   </span>
   <br />
    <span>
   Label:  {apiItemData.label}
   </span> 
   <br /> 
      </>
     )}
  </>
)}


                      
                    </>
                  ) : null}
                  <input
                    type="submit"
                    className="btn btn-light btn-shadow m-t-20 m-r-10"
                    value="Update Data"
                  />
                  <input
                    type="button"
                    className="btn btn-light btn-shadow m-t-20 m-l-0"
                    value="Cancel"
                    onClick={() => {
                      if (selectControl) {
                        selectControl(undefined);
                      }
                    }}
                  />
                </form>
              </div>
              <div className="m-t-20"></div>
              <div className="main-form">
                <form
                  onSubmit={onMoveControlFormSubmit}
                  style={{ minWidth: "100%" }}
                >
                  <div className="main-form-title" style={{marginBottom:'5px'}}>Move Control to Step</div>
                  <div style={{marginBottom:'10px'}}>
                    <FormControl style={{ minWidth: "100%" }}>
                      <div> <label htmlFor="" className='m-b-0'>Select Step</label> </div>
                      {/* <InputLabel>Step:</InputLabel> */}
                      <Select
                        name="containerId"
                        value={
                          moveControlObj && moveControlObj.containerId
                            ? moveControlObj.containerId
                            : ""
                        }
                        onChange={handleMoveControlSelectChange}                        
                      >
                        {props.formLayoutComponents.map((item, ind) => {
                          return (
                            <MenuItem
                              key={item.container.id}
                              value={item.container.id}
                            >
                              Step {ind + 1}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl style={{ minWidth: "100%" }}>
                    <div> <label htmlFor="" className='m-b-0'>Select Position</label> </div>
                      {/* <InputLabel>Position:</InputLabel> */}
                      <Select
                        name="position"
                        value={
                          moveControlObj && moveControlObj.position ? moveControlObj.position : ""
                        }
                        onChange={handleMoveControlSelectChange}                       
                      >
                        {getPositions()}
                      </Select>
                    </FormControl>
                  </div>
                  <input
                    type="submit"
                    className="btn btn-light btn-shadow m-t-10 m-r-10"
                    value="Move"
                  />
                  <input
                    type="button"
                    className="btn btn-light btn-shadow m-t-10 m-l-0"
                    value="Cancel"
                    onClick={() => {
                      if (selectControl) {
                        selectControl(undefined);
                      }
                    }}
                  />
                </form>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <h4>Edit Properties</h4>
          <div
            role="alert"
            className="m-t-30 alert alert-dark alert-dismissible"
          >
            <h4>Note!</h4>
            You need to select a container/control to edit properties.
          </div>
        </>
      )}
    </>
  );
}

export default EditPropertiesComponent;