import React, {FC, useEffect, useState} from 'react'
import { FormLayoutCoponentChildrenItemsType } from '../../../types/FormTemplateTypes';
import { Button, FormControl, FormControlLabel, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Radio, RadioGroup, TextField } from '@mui/material';
import { Delete, Edit, Label } from '@mui/icons-material';
import { generateID } from '../../../utils/common';
import { makeStyles } from 'tss-react/mui';
import ProcedureBuilderPage from '../../ReportBuilder/ProcedureBUilder';
import SelectedCoulmnsComponent from './selecetedCoulmns';
interface ManageItemsListComponentFromQueryProps{
  // items: FormLayoutCoponentChildrenItemsType[] | undefined;
  handleFormSubmit: ()=>void;
  // deleteItemFromList: (item: FormLayoutCoponentChildrenItemsType)=>void;
  // editIteminList: (item: FormLayoutCoponentChildrenItemsType)=>void;
}

const useStyles = makeStyles()(() => ({
  textField: {
    minWidth: "100%",
    maxWidth: "100%",
  },
  sidebarHeight: {
    height: "calc(100vh - 63px);",
    overflowY: "auto",
  },
})); 
const ManageItemsListComponentFromQuery: FC<ManageItemsListComponentFromQueryProps> = (props)=> {

  // const [runningItemId, setRunningItemId] = useState(3);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string>('');
  const [editItemId, setEditItemId] = useState<string | undefined>(undefined)
  const [selectedQueryType, setSelectedQueryType] = useState('New'); 
  const [queryTemplateName, setQueryTemplateName] = useState('Undefined'); 
  const [resultedQuery, setResultedQuery] = useState('Out Put Query Here'); 
  const [resultedData, setResultedData] = useState(); 
  const [currentStep, setCurrentStep] = useState(1); 
  const { handleFormSubmit } = props;
  const [isShowJoin, setIsShowJoin] = useState(false);
  const [isShowConditions, setIsShowConditions] = useState(false);
  const [checkboxState, setCheckboxState] = useState({});

  // Function to update checkbox state
  const handleCheckboxChange = (database, type) => {
    console.log(resultedData);
    setCheckboxState(prevState => {
      const updatedState = { ...prevState };
      // Disable the checkbox of the same type in other databases
      Object.keys(updatedState).forEach(db => {
        if (db !== database) {
          updatedState[db] = {
            id: type === 'id' ? false : updatedState[db]?.id,
            value: type === 'value' ? false : updatedState[db]?.value
          };
        }
      });
      // Toggle the checkbox state for the selected database and type
      updatedState[database] = {
        ...updatedState[database],
        [type]: !prevState[database]?.[type]
      };
      return updatedState;
    });
  };

  // useEffect(() => {
  //   cancelEditing();
  // }, [items])
  
  const {classes} = useStyles();
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e)=>{
    const { name, value } = e.target;
    setQueryTemplateName(value);
  }

  const changeToEditMode = (item: FormLayoutCoponentChildrenItemsType)=>{
    setItemName(item.label);
    setEditItemId(item.id);
    setEditMode(true);
  }

  const gotToStepOne: React.MouseEventHandler<HTMLInputElement> = (event)=>{
    setCurrentStep(1);
  }
  const gotToStepTwo: React.MouseEventHandler<HTMLInputElement> = (event)=>{
    setCurrentStep(2);
  }
  const gotToStepThree: React.MouseEventHandler<HTMLInputElement> = (event)=>{
    setCurrentStep(3);
  }
  const onSubmit: React.MouseEventHandler<HTMLInputElement> = (event)=>{
    if(itemName !== null && itemName !== ''){
      // if(!editMode){
      //   addItemInList({
      //     id: generateID(),
      //     value: itemName.replace(" ","__-"),
      //     label: itemName
      //   });
      // } else{
      //   editIteminList({
      //     id: editItemId as string,
      //     value: itemName.replace(" ","__-"),
      //     label: itemName
      //   })
      // }
    }
  }

  const cancelEditing = ()=>{
    setEditMode(false);
    setItemName('');
    setEditItemId(undefined);
  }

  const handleSelectedQueryTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedQueryType(event.target.value);
};
  
  

  function saveQuery(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    


  }

  return ( <>

  {currentStep == 1 ? (
   <div className="p-30" style={{ minHeight: "500px" }}>
 <div
              className=""
              style={{
                maxWidth: "360px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
               <h4>Enter the following details:</h4>
               <form onSubmit={handleFormSubmit} style={{ minWidth: "100%" }}>
  
  <div>
    <FormControl>
          <RadioGroup name={"queryType"} value = {selectedQueryType} onChange={handleSelectedQueryTypeChange} row>
           
              <FormControlLabel value={"New"} key={"New"} control={<Radio />} label={"New Query"} />
              <FormControlLabel value={"Old"} key={"Old"} control={<Radio />} label={"From Templates Query"} />
          
          </RadioGroup>
        </FormControl>
        {selectedQueryType == "New" && (<><TextField
        label='Query Template Name'
        name='newItem'
        value={queryTemplateName}
        onChange={handleChange}
        style={{ minWidth: '100%' }} />
        <input
          className="btn btn-light btn-shadow m-t-20 m-r-10"
          value={ "Next"}
          type='button'
          onClick={ gotToStepTwo} />
          
          
          </>
      
      )}
       {selectedQueryType == "Old" && (<>
        <input
          className="btn btn-light btn-shadow m-t-20 m-r-10"
          value={ "Query Builder"}
          type='button'
          onClick={onSubmit} />
          
          
          </>
      
      )}
      
      {/* {
        editMode && <input 
          className="btn btn-light btn-shadow m-t-20 m-r-10"
          value='Cancel'
          type='button'
          onClick={cancelEditing}
        />
      } */}
      {/* <List component="nav">
        {items?.map((item,ind)=>{
          return <ListItem key={item.value}>
            <ListItemText primary={item.label} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={()=>changeToEditMode(item)}>
                <Edit />
              </IconButton>
              <IconButton onClick={()=>deleteItemFromList(item)} edge="end">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>     
          </ListItem>
        })}
      </List> */}
    </div>
  
    </form>
    </div>

    </div>
  
  
  ) : currentStep == 2 ? (

    <div className="wrapper">
    <div className="row">
      <div
        className={classes.sidebarHeight + " sidebar col-lg-2"}
        style={{ paddingLeft: "30px !important" }}
      >
        <div className="container">
        <Button  onClick={() => { setIsShowJoin(!isShowJoin);}} style={{marginRight:'10px'}}>
                       {isShowJoin ? 'Hide Join' : 'Add Join'} 
                    </Button> <br />
                    <Button  onClick={() => { setIsShowConditions(!isShowConditions);}}>
                       {isShowConditions ? 'Hide Conditions' : 'Add Conditions'} 
                    </Button> <br />
         1 <br />
         1 <br />
         1 <br />
        </div>
      </div>
      <div className="col-lg-8">
        <div className="container p-20 h-100">
          {/* Form Details and Action */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-between">
                <h4 className="mb-0">{queryTemplateName}</h4>
                <div className="action-buttons d-flex">
                <Button onClick={saveQuery}> Save</Button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="p-20"
            style={{
              overflowY: "auto",
              height: "calc(100vh - 180px)",
            }}
          >
           
            <div className="row mb-5">
             <ProcedureBuilderPage  isShowJoin={isShowJoin} isShowConditions={isShowConditions} setResultedQuery={setResultedQuery} setResultedData={setResultedData}/>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.sidebarHeight + " sidebar col-lg-2"}>
        <div className="container">
         
        <div>
        <Button  onClick={() => { onSubmit();}}>
                        Add As Item
                    </Button>
      {resultedData?.map((i, ind) => (
       
        
        <SelectedCoulmnsComponent
        key={ind}
        database={i.id}
        idChecked={checkboxState[i.id]?.id || false}
        valueChecked={checkboxState[i.id]?.value || false}
        handleCheckboxChange={handleCheckboxChange}
        />
      ))}
    </div>
                            
        </div>
      </div>
    </div>
  </div>



  ) : null}
    
  </> );
}

export default ManageItemsListComponentFromQuery;