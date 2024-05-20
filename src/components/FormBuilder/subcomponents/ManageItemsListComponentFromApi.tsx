import React, {ForwardRefRenderFunction,forwardRef, useEffect, useState,useImperativeHandle, Ref} from 'react'
import { FormLayoutCoponentChildrenItemsType } from '../../../types/FormTemplateTypes';
import { Button, FormControl, FormControlLabel, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Radio, RadioGroup, TextField } from '@mui/material';
import { Delete, Edit, Label } from '@mui/icons-material';
import { generateID } from '../../../utils/common';
import { makeStyles } from 'tss-react/mui';
import ProcedureBuilderPage from '../../ReportBuilder/ProcedureBUilder';
import SelectedCoulmnsComponent from './selecetedCoulmns';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DynamicTable from '../../ReportBuilder/DynamicTable';




interface Column {
  id: 'id' | 'apiName' | 'baseUrl' | 'apiUrl' | 'headerDetails' | 'isEXternal' | 'parameters' | 'method'| 'failureResponse'| 'successResponse';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}
interface ManageItemsListComponentFromApiProps{
  // items: FormLayoutCoponentChildrenItemsType[] | undefined;
  handleFormSubmit: ()=>void;
  setApiItemData: (data:object)=>void;
  // deleteItemFromList: (item: FormLayoutCoponentChildrenItemsType)=>void;
  // editIteminList: (item: FormLayoutCoponentChildrenItemsType)=>void;
}

interface ManageStepBackRef {
  setCurrentStepExternal: (step?: string) => void;
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
const ManageItemsListComponentFromApi: ForwardRefRenderFunction<ManageStepBackRef,ManageItemsListComponentFromApiProps> = (props)=> {

  // const [runningItemId, setRunningItemId] = useState(3);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string>('');
  const [editItemId, setEditItemId] = useState<string | undefined>(undefined)
  const [selectedQueryType, setSelectedQueryType] = useState('New'); 
  const [queryTemplateName, setQueryTemplateName] = useState('Undefined'); 
  const [resultedQuery, setResultedQuery] = useState('Out Put Query Here'); 
  const [resultedData, setResultedData] = useState(); 
  const [postData, setPostData] = useState();
  const [allCoulmnWithType, setAllCoulmnWithType] = useState();
  const [currentStep, setCurrentStep] = useState(1); 
  const { handleFormSubmit,setApiItemData,setisSetApiItemData } = props;
  const [isShowJoin, setIsShowJoin] = useState(false);
  const [isShowTemplateData, setIsShowTemplateData] = useState(false);
  const [isShowConditions, setIsShowConditions] = useState(false);
  const [checkboxState, setCheckboxState] = useState({});
  const [selectedItemID, setSelectedItemID] = useState(''); 
  const [selectedItemValue, setSelectedItemValue] = useState(''); 
  const [queryTemplateData, setQueryTemplateData] = useState();
  const [isShowResultData, setIsShowResultData] = useState(false);
  const [resulteData, setResulteData] = useState();
  const [keysList, setKeysList] = useState();
  const [previewResult, setPreviewResult] = useState([]);
  const [previewResultHeader, setPreviewResultHeader] = useState();
  const [isShowPreviewData, setIsShowPreviewData] = useState(false);
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
  const setCurrentStepExternal = (step)=>{
    step = step - 1;
    setCurrentStep(step);
  }
  const gotToStepTwo: React.MouseEventHandler<HTMLInputElement> = (event)=>{
    setCurrentStep(2);
  }
  const gotToStepThree: React.MouseEventHandler<HTMLInputElement> = (event)=>{
    setCurrentStep(3);
  }

  const useQueryTemplate  = (row)=>{

console.log("DDDDDDDDDDDDDDDDD",row.successResponse);
const successData = JSON.parse(row.successResponse);
console.log("EEEEEEEEEEEEEEE",successData);
const keys = Object.keys(successData[0]);
// const array =  row['columns'].split(','); //row['columns']
const newArray = keys.map(item => ({ id: item, value: item }));
setKeysList(newArray);
setResultedData(row);
setQueryTemplateName(row['apiName']);
setCurrentStep(2);
  }
  const loadTemplate  = ()=>{
    const apiUrl = 'http://172.16.61.31:7083/api/ApiMaster/GetAllApiMaster';

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 1) {
                  setQueryTemplateData(data.responseValue);
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                console.error('There was a problem fetching the data:', error);
            })
            .finally(() => {
                // setIsLoading(false);
            });
    //setIsShowTemplateData(true);
  }
  const onSubmit: React.MouseEventHandler<HTMLInputElement> = (event)=>{
    // if(selectedItemID !== null && selectedItemID !== ''){
      var selectedItemId1 = '';
      var selectedItemValue1 = '';
      Object.keys(checkboxState).forEach(database => {
       
        if (checkboxState[database]?.id) {
          console.log("DDDDDDIIIIIIIIIIIIIIIDDDDDD",database);
          selectedItemId1 = database;
          setSelectedItemID(database);
          
        }
        if (checkboxState[database]?.value) {
          selectedItemValue1 = database;
          setSelectedItemValue(database);
        }
      });
      console.log("$$$$$$$$$$$$",allCoulmnWithType);
      const typeOfSelectedId = allCoulmnWithType.find(item => item.id === selectedItemId1);
      // if(selectedItemID !== null && selectedItemID !== ''){
        setApiItemData({
          queryId:'1',
          queryTemplateName:queryTemplateName,
          id: selectedItemId1,
          value: selectedItemValue1,
          label: selectedItemValue1,
          schemaName : postData.schemaName,
          fullQuery : postData.fullQuery,
          typeOfSelectedId : typeOfSelectedId.type
        })
        setisSetApiItemData(true);
      // }
      
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
    // }
  }

  const cancelEditing = ()=>{
    setEditMode(false);
    setItemName('');
    setEditItemId(undefined);
  }

  const handleSelectedQueryTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedQueryType(event.target.value);
    loadTemplate();
};

const findKeysWithPattern = (obj, pattern) => {
  const requiredKeys = [];

  // Iterate over each property in the object
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) { // Check if the key is actually a property of the object
      const value = obj[key];
      // Check if the value is a string and ends with the specified pattern
      if (typeof value === 'string' && value.endsWith(pattern)) {
        requiredKeys.push(key);
      }
    }
  }

  // Return the array of keys that have values ending with the pattern
  return requiredKeys;
}


const executeQueryTemplateInApi = async (apiData) => {
  var requiredParams = [];
  if(apiData.parameters != "")
    {
       requiredParams = findKeysWithPattern(apiData.parameters,"[*]");
    }
    if(requiredParams.length > 0)
      {
        alert("required parameters");
      }
  
  try {
    const response = await fetch(apiData.apiUrl, {
      method: apiData.method,
      headers: {
        'Content-Type': 'application/json'
      }
      // Include body if needed, depending on the method
      // body: JSON.stringify(apiData.parameters)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    const tableHeaders = data.responseValue.length > 0 ? Object.keys(data.responseValue[0]) : [];
    console.log("FFFFFFFFF",tableHeaders);
    setPreviewResultHeader(tableHeaders);
    setPreviewResult(data.responseValue);
    setIsShowPreviewData(true);
    setCurrentStep(3);
  } catch (error) {
    // setError(error.message);
    throw new Error(error.message);
  } finally {
    // setLoading(false);
  }
};


const columns: readonly Column[] = [
  { id: 'id', label: 'Id', minWidth: 10 },
  { id: 'apiName', label: 'Api Name', minWidth: 100 },
  { id: 'baseUrl', label: 'Base Url', minWidth: 100 },
  { id: 'apiUrl', label: 'Api Url', minWidth: 100 },
  { id: 'headerDetails', label: 'Headers', minWidth: 100 },
  { id: 'isEXternal', label: 'Is External', minWidth: 100 },
  { id: 'parameters', label: 'Parameters', minWidth: 100 },
  { id: 'method', label: 'Method', minWidth: 100 },
  { id: 'failureResponse', label: 'Failure Response', minWidth: 100 },
  { id: 'successResponse', label: 'Success Response', minWidth: 100 }
 
];

  function saveQuery(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    saveQueryTemplateInApi();


  }
  // useImperativeHandle(ref, () => ({
  //   setCurrentStepExternal: (step?: string) => setCurrentStep(step - 1)
  // }));

  return ( <>

  {currentStep == 1 ? (
   <div className="p-30" style={{ minHeight: "500px" }}>
 <div
              className=""
              style={{
                maxWidth: selectedQueryType == "Old" ? "100%" : "360px",
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
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
  <TableContainer sx={{ maxHeight: 600 }}>
    <Table stickyHeader aria-label="sticky table" className='table table-bordered table-template-query'>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              align={column.align}
              style={{ minWidth: column.minWidth }}
            >
              {column.label}
            </TableCell>
          ))}
          <TableCell
              key={'Action'}
              align={'center'}
              style={{ minWidth: '' }}
            >
              {'Action'}
            </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        { queryTemplateData && queryTemplateData.map((row) => {
          function handleAction(id: any): void {
            throw new Error('Function not implemented.');
          }

          function editTemplate(id: any): void {
            throw new Error('Function not implemented.');
          }

          function deleteTemplate(id: any): void {
            throw new Error('Function not implemented.');
          }

            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {value}
                    </TableCell>
                  );
                })}
                 <TableCell key={'Action'} align={'center'}>
                  <div className='table-query-button'>
                 <Button onClick={() => useQueryTemplate(row)}>Use Template</Button>
                 </div>
                    </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  </TableContainer>

</Paper>
          </>
      
      )}
         {isShowResultData == true && (<DynamicTable data={resulteData} />) }
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
        {/* {resultedData.headerDetails} <br />
        {resultedData.method} <br /> */}
        {resultedData.parameters} <br />
         {/* 1 <br />
         1 <br />
         1 <br /> */}
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
                {/* <Button onClick={saveQuery}> Save</Button> */}
                <Button onClick={() => {executeQueryTemplateInApi(resultedData);}}> Preview Api</Button>
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
             {/* <ProcedureBuilderPage  isShowJoin={isShowJoin} isShowConditions={isShowConditions} setResultedQuery={setResultedQuery} setResultedData={setResultedData} setPostData={setPostData} setAllCoulmnWithType={setAllCoulmnWithType}/> */}
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
      {keysList?.map((i, ind) => (
       
        
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



  ) : isShowPreviewData ? (
    <div>
    <table>
      <thead>
        <tr>
          {previewResultHeader.map(header => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {previewResult.map((item, index) => (
          <tr key={index}>
            {previewResultHeader.map(header => (
              <td key={`${index}-${header}`}>{item[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  ) : null
  }
    
  </> );
}

export default forwardRef(ManageItemsListComponentFromApi);


