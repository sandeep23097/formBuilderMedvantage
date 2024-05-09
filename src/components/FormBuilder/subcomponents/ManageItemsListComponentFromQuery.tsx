import React, {FC, useEffect, useState} from 'react'
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
  id: 'id' | 'queryTemplateName' | 'schemaName' | 'tableName' | 'columns' | 'whereCondition' | 'joinTableNames'| 'joinConditions'| 'joinTypes';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}
interface ManageItemsListComponentFromQueryProps{
  // items: FormLayoutCoponentChildrenItemsType[] | undefined;
  handleFormSubmit: ()=>void;
  setApiItemData: (data:object)=>void;
  setisSetApiItemData: (data:object)=>void;
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
  const [postData, setPostData] = useState();
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

  const useQueryTemplate  = (row)=>{
//build schema_name
//table_name
//columns
//where_condition
//join_table_names
//join_conditions
//join_types

//Pass to procedureBuilder
let d = "apple, banana, orange";
const array =  row['columns'].split(','); //row['columns']
const newArray = array.map(item => ({ id: item, value: item }));
setResultedData(newArray);
setQueryTemplateName(row['queryTemplateName']);
setCurrentStep(2);
  }
  const loadTemplate  = ()=>{
    const apiUrl = 'http://172.16.61.31:7105/api/Form/GetQuery';

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
      // if(selectedItemID !== null && selectedItemID !== ''){
        setApiItemData({
          queryId:'1',
          queryTemplateName:queryTemplateName,
          id: selectedItemId1,
          value: selectedItemValue1,
          label: selectedItemValue1,
          schemaName : postData.schemaName,
          fullQuery : postData.fullQuery
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


const saveQueryTemplateInApi = () => {
  var data = postData;
  data.queryTemplateName = queryTemplateName;
    
    fetch('http://172.16.61.31:7105/api/Form/InsertQuery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

const executeQueryTemplateInApi = (event: MouseEvent<HTMLButtonElement, MouseEvent>) => {

  var data = {
    "schemaName": postData.schemaName,
  "sqlStateMent": postData.fullQuery,
  }
    
    fetch('http://172.16.61.31:7105/api/DynamicQuery/ExecuteQuery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
     
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      setResulteData(data);
      setIsShowResultData(true);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
  
const columns: readonly Column[] = [
  { id: 'id', label: 'Id', minWidth: 10 },
  { id: 'queryTemplateName', label: 'Template Name', minWidth: 100 },
  { id: 'schemaName', label: 'DataBase Name', minWidth: 100 },
  { id: 'tableName', label: 'Table Name', minWidth: 100 },
  { id: 'columns', label: 'Columns Name', minWidth: 100 },
  { id: 'whereCondition', label: 'Condtions', minWidth: 100 },
  { id: 'joinTableNames', label: 'Join Table Name', minWidth: 100 },
  { id: 'joinConditions', label: 'Join Condtion', minWidth: 100 },
  { id: 'joinTypes', label: 'Join Types', minWidth: 100 }
 
];

  function saveQuery(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
    saveQueryTemplateInApi();


  }

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
                <Button onClick={executeQueryTemplateInApi}> Preview Query</Button>
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
             <ProcedureBuilderPage  isShowJoin={isShowJoin} isShowConditions={isShowConditions} setResultedQuery={setResultedQuery} setResultedData={setResultedData} setPostData={setPostData}/>
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



  ) :  null}
    
  </> );
}

export default ManageItemsListComponentFromQuery;