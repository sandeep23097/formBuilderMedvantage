import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { FunctionComponent, useEffect, useState } from "react";
import ListBoxP from "./ListBox";
import Box from "@mui/material/Box";
import Multiselect from 'multiselect-react-dropdown';
import { FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import './style.css';
import JoinButtonComponent from "./subComponents/AddJoinButtonComponent";
// import {JoinButtonComponent} from'./subComponents/AddJoinButtonComponent';
interface ProcedureBuilderPageProps { 
    
    isShowJoin: boolean;
    isShowConditions: boolean;
    setResultedQuery: (item: any) => void;
    setResultedData: (item: any) => void;
    setPostData: (item: any) => void;
}

const ProcedureBuilderPage: FunctionComponent<ProcedureBuilderPageProps> = (props) => {
    // Dummy data for items
    const { isShowJoin,isShowConditions,setResultedQuery,setResultedData,setPostData,setAllCoulmnWithType } = props;
    const joinTypeItems = [
        { label: 'INNER JOIN', value: 'INNER JOIN' },
        { label: 'LEFT JOIN', value: 'LEFT JOIN' },
        { label: 'RIGHT JOIN', value: 'RIGHT JOIN' },
    ];

    const conditionsItems = [
        { label: '=', value: '=' },
        { label: '>', value: '>' },
        { label: '<', value: '<' },
    ];
    const db = { database: 'Select' };
    const tablesM = { tableName: 'Select' };
    const coulmnM = { coulmn: 'Select' };
    const [databases, setDatabases] = useState();
    const [isLoading, setIsLoading] = useState(true);
    // const [isShowJoin, setIsShowJoin] = useState(false);
    // const [isShowConditions, setIsShowConditions] = useState(false);
    const [isShowTxtValue, setShowTxtValue] = useState(false);
    const [isShowColValue, setShowColValue] = useState(false);

    const [selectedDatabase, setSelectedDatabase] = useState('');
    const [selectedTable, setSelectedTable] = useState('');
    const [selectedFirstJoinCoulmn, setSelectedFirstJoinCoulmn] = useState('');
    const [selectedSecondJoinCoulmn, setSelectedSecondJoinCoulmn] = useState('');

    const [selectedFirstJoinTable, setSelectedFirstJoinTable] = useState('');
    const [selectedSecondJoinTable, setSelectedSecondJoinTable] = useState('');
    const [selectedOperator, setSelectedOperator] = useState('');
    const [selectedJoinType, setSelectedJoinType] = useState('');
    const [selectedFirstCondtionTable, setSelectedFirstCondtionTable] = useState('');
    const [selectedSecondCondtionTable, setSelectedSecondCondtionTable] = useState('');

    const [tables, setTables] = useState();
    const [tablesJoinsList, setTablesJoinsList] = useState([]);
    const [coulmns, setCoulmns] = useState();
    const [joincoulmns1, setJoinCoulmns1] = useState();
    const [joincoulmns2, setJoinCoulmns2] = useState();
  

    const [joinList, setJoinList] = useState([]);
    const [conditionList, setConditionList] = useState([]);
    const [selectedCols, setSelectedCols] = useState([]);
    const [sqlQuery, setSqlQuery] = useState<string>('');

    const [selectedColsString, setSelectedColsString] = useState<string>('');
    const [selectedConditionString, setSelectedConditionString] = useState<string>('');
    const [selectedJoinTableString, setSelectedJoinTableString] = useState<string>('');
    const [selectedJoinCondtionString, setSelectedJoinCondtionString] = useState<string>('');
    const [selectedJoinTypeString, setSelectedJoinTypeString] = useState<string>('');
    useEffect(() => {
        if (selectedDatabase) {
            setIsLoading(true);
            fetchTables(selectedDatabase)
                .then(data => {
                    setTables(data);
                })
                .catch(error => {
                    console.error('Error fetching tables:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [selectedDatabase]);


    useEffect(() => {
        if (tablesJoinsList && selectedDatabase) {
            setIsLoading(true);
            fetchCoulmns2(tablesJoinsList, selectedDatabase)
                .then(data => {
                    setCoulmns(data);
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error fetching tables:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [tablesJoinsList]);



    useEffect(() => {
        if (selectedTable && selectedDatabase) {
            setIsLoading(true);
            fetchCoulmns(selectedTable, selectedDatabase)
                .then(data => {
                    setCoulmns(data);
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error fetching tables:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [selectedTable]);


    useEffect(() => {
        if (selectedFirstJoinTable && selectedDatabase) {
            setIsLoading(true);
            fetchCoulmns(selectedFirstJoinTable, selectedDatabase)
                .then(data => {
                    setJoinCoulmns1(data);
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error fetching tables:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [selectedFirstJoinTable]);



    useEffect(() => {
        if (selectedSecondJoinTable && selectedDatabase) {
            setIsLoading(true);
            fetchCoulmns(selectedSecondJoinTable, selectedDatabase)
                .then(data => {
                    setJoinCoulmns2(data);
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error fetching tables:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [selectedSecondJoinTable]);



    const fetchTables = async (database: string) => {
        // const apiUrl = `https://localhost:5001/api/FHIR/GetAllTables?databaseName=${database}`;
        const apiUrl = `http://172.16.61.31:7105/api/Form/GetAllTables?databaseName=${database}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Extract the key dynamically from the first response object
        const key = Object.keys(data.responseValue[0])[0];

        // Extract the table names using the dynamic key
        const tableNames = data.responseValue.map((obj: { [x: string]: any; }) => obj[key]);

        // Create new objects with the desired key name
        const tablesWithNewKeyName = tableNames.map((tableNames: any) => ({ tableName: tableNames }));

        return tablesWithNewKeyName;


    };
    const fetchCoulmns = async (table: string, db: string) => {
        const apiUrl = `http://172.16.61.31:7105/api/Form/GetAllCoulmns?databaseName=${db}&tableName=${table}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        // const coulmnNames = data.responseValue.map((obj: { [x: string]: any; }) => {name: obj['field'],type:obj['type']});
        // console.log("###################",coulmnNames);

        // Create new objects with the desired key name
        const coulmnWithNewKeyName = data.responseValue.map((obj: { [x: string]: any; }) => ({ field: table + "." + obj['field'], id: table + "." + obj['field'],type:obj['type'] }));

        return coulmnWithNewKeyName;
        //   return data;


    };

    const fetchCoulmns2 = async (tables: [], db: string) => {
        var mainList =  [];
        tables.forEach(async table => {
            const apiUrl = `http://172.16.61.31:7105/api/Form/GetAllCoulmns?databaseName=${db}&tableName=${table}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
           // const coulmnNames = data.responseValue.map((obj: { [x: string]: any; }) => obj['field']);
    
            // Create new objects with the desired key name
            const coulmnWithNewKeyName = data.responseValue.map((obj: { [x: string]: any; }) => ({ field: table + "." + obj['field'], id: table + "." + obj['field'],type:obj['type'] }));

           // const coulmnWithNewKeyName = coulmnNames.map((cNames: any) => ({ field: db + "." + cNames, id: db + "." +  cNames,type:cNames.type }));
            var c = [...mainList, ...coulmnWithNewKeyName];
            mainList = c;
        });
        

        return mainList;
        //   return data;


    };


    const handleDatabaseChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedDatabase(event.target.value);
    };

    const handleTableChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        var li = tablesJoinsList;
        if(!li.includes(event.target.value))
            {
                li.push(event.target.value);
                setTablesJoinsList(li);
            }
        
        
        setSelectedTable(event.target.value);
    };
    const handleJoinTableChange1 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedFirstJoinTable(event.target.value);
    };
    const handleRightChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedSecondCondtionTable(event.target.value);
    };
    const handleJoinTableChange2 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedSecondJoinTable(event.target.value);
    };
    const handleOperatorChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedOperator(event.target.value);
    };
    const handleJoinCoulmnChange1 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedFirstJoinCoulmn(event.target.value);
    };
    const handleJoinCoulmnChange2 = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedSecondJoinCoulmn(event.target.value);
    };

    const handleJoinTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelectedJoinType(event.target.value);
    };

    const addJoinInList = () => {
        var fTable = selectedFirstJoinTable;
        var sTable = selectedSecondJoinTable;
        var fCol = selectedFirstJoinCoulmn;
        var sCol = selectedSecondJoinCoulmn;
        var li = [];
         li = joinList;
        var d =  {firstTable : fTable ,secondTable : sTable,first :  fCol, second :  sCol,type:selectedJoinType};
        const isDuplicate = li.some(item => (
            item.firstTable === d.firstTable &&
            item.secondTable === d.secondTable &&
            item.first === d.first &&
            item.second === d.second &&
            item.type === d.type
          ));
          if (!isDuplicate) 
            {
                li.push(d);
                setJoinList(li)
            }
    
        console.log(li);
        var li2 = tablesJoinsList;
        if(!li2.includes(selectedSecondJoinTable))
            {
                li2.push(selectedSecondJoinTable);
                setTablesJoinsList(li2);
                fetchCoulmns(selectedSecondJoinTable, selectedDatabase)
                .then(data => {
                    console.log('datadatadatadatadatadata',data);
                    var t = coulmns;
                    const mergedList = [...t, ...data];
                    setCoulmns(mergedList);
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error fetching tables:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
            }
            generateQuery();
    };



    const addConditionInList = () => {
        var fTable = selectedFirstCondtionTable;
        var sTable = selectedSecondCondtionTable;
        var li = [];
         li = conditionList;
        var d =  {first : fTable , second : sTable,condtionType:selectedOperator };
        const isDuplicate = li.some(item => (
            item.first === d.first &&
            item.second === d.second &&
            item.condtionType === d.condtionType
          ));
          if (!isDuplicate) 
            {
                li.push(d);
                setConditionList(li)
            }
    
        
            generateQuery();
    };


    useEffect(() => {
        const apiUrl = 'http://172.16.61.31:7105/api/Form/GetAllSchemas';

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 1) {
                    setDatabases(data.responseValue);
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                console.error('There was a problem fetching the data:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);



    const generateQuery = () => {
        let query = 'SELECT ';
        setAllCoulmnWithType(selectedCols);
        var colString = selectedCols.map(col => col.id).join(', ');
        setSelectedColsString(colString);
        query += colString;
        query += ' FROM ';
        query += selectedTable;//selectedTable.map(table => table.name).join(', ');
        var joinString = '';
        if (joinList.length > 0) {
            joinList.forEach(join => {
                //joinString += secondTable " " + join.type + " " + join.secondTable + " ON " + join.first +  " = " + join.second;

            query += " " + join.type + " " + join.secondTable + " ON " + join.first +  " = " + join.second;
          });
        //   setSelectedJoinString(joinString);
        }
        var joinTableArray = [];
        var joinTableString = '';
        var joinConditionString = '';
        var joinTypenString = '';
        if (joinList.length > 0) {
            joinList.forEach(join => {
                if(!joinTableArray.includes(join.secondTable))
                    {
                        joinTableArray.push(join.secondTable);
                    }
                    if(!joinTableArray.includes(join.firstTable))
                        {
                            joinTableArray.push(join.firstTable);
                        }
                        joinConditionString = joinConditionString + join.first +  " = " + join.second + ";"; 
                        joinTypenString = joinTypenString + join.type +";";
              
          });
          joinTableString = joinTableArray.map(col => col).join(';');
          setSelectedJoinTableString(joinTableString);
          setSelectedJoinTypeString(joinTypenString);
          setSelectedJoinCondtionString(joinConditionString)
        //   setSelectedJoinString(joinString);
        }


        var conditionString = '';
        if (conditionList.length > 0) {
          query += ' WHERE ';
          var i = 0;
          conditionList.forEach(condition => {
            if(i != 0)
                {
                    conditionString = conditionString + " AND ";
                    query += " AND "
                }
                conditionString = conditionString + condition.first + "  " + condition.condtionType +  " " + condition.second;
            query +=  condition.first + "  " + condition.condtionType +  " " + condition.second;
            i++;
          });
          setSelectedConditionString(conditionString);
        }
    
        setSqlQuery(query);
        setResultedQuery(query);
        setResultedData(selectedCols);
        const postData = {
            queryTemplateName: 'Undefined',
            schemaName: selectedDatabase,
            tableName: selectedTable,
            columns: selectedColsString,
            whereCondition: conditionString,
            joinTableNames: selectedJoinTableString,
            joinConditions: selectedJoinCondtionString,
            joinTypes: selectedJoinTypeString,
            fullQuery : query,
            userId: 0,
            clientId: 0,
          };
          setPostData(postData);
      };


      const onSelect = (selectedList, selectedItem) => {
        console.log("selectedList",selectedList);
        setSelectedCols(selectedList);
      console.log("selectedItem",selectedItem);
       }
       const onRemove = (selectedList, removedItem) => {
        console.log("selectedList",selectedList);
        setSelectedCols(selectedList);
        console.log("removedItem",removedItem);
         }

   

         const displayConditionOption = (event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
           
                if(event.target.value == "txtValue")
                    {
                        setShowTxtValue(true);
                        setShowColValue(false);
                    }
                    else if(event.target.value == "colValue")
                        {
                            setShowTxtValue(false);
                            setShowColValue(true);
                        }
        console.log("Function not implemented.",event.target.value);
         }

    function handleCondtionFirstTableSection(event: SelectChangeEvent<any>, child: ReactNode): void {
        setSelectedFirstCondtionTable(event.target.value);
    }

    return (
        <div className="container mt-60">            
            <div className="container-legent">
             <div className="new-heading">Conditional Selection</div>
            <div className="row mt-2">
                <div className="col-md-6 col-lg-6 col-xl-3 mb-3">
                    <FormControl>
                        {/* <InputLabel id="dropdown-label">Select DataBase</InputLabel> */}
                        {/* <br/> */}
                        <label className="label">Select Data Base</label>   
                                             
                        {/* <InputLabel>{item.labelName + (item.required ? " *" : "")}</InputLabel> */}
                        <Select
                            value={selectedDatabase}
                            onChange={handleDatabaseChange}
                            variant='outlined'
                        >
                            {databases?.map((i, ind) => (
                                <MenuItem key={i.database} value={i.database}>{i.database}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="col-md-6 col-lg-6 col-xl-3 mb-3">
                    <FormControl>
                        {/* <InputLabel>{item.labelName + (item.required ? " *" : "")}</InputLabel> */}
                        {/* <InputLabel id="dropdown-label">Select Table</InputLabel>
                        <br /> */}
                        <label className="label">Select Table</label> 
                        <Select
                            value={selectedTable}
                            onChange={handleTableChange}
                            variant='outlined'
                        >
                            {tables?.map((i, ind) => (
                                <MenuItem key={i.tableName} value={i.tableName}>{i.tableName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="col-md-6 col-lg-6 col-xl-3 mb-3">
                    <FormControl>
                        {/* <InputLabel>{item.labelName + (item.required ? " *" : "")}</InputLabel> */}
                        {/* <InputLabel id="dropdown-label">Select Coulmns</InputLabel>
                        <br /> */}
                        <label className="label">Select Coulmns</label> 
                        {/* <Select
                            // style={{ minWidth: '100%' }}
                            variant='outlined'// Assuming default value is the first item's value
                        >
                            {coulmns?.map((i, ind) => (
                                <MenuItem key={coulmns.field} value={i.field}>{i.field}</MenuItem>
                            ))}
                        </Select> */}


                        <Multiselect
                            options={coulmns} // Options to display in the dropdown
                            // selectedValues={'Seclect'} // Preselected value to persist in dropdown
                            onSelect={onSelect} // Function will trigger on select event
                            onRemove={onRemove} // Function will trigger on remove event
                            displayValue="field" // Property name to display in the dropdown options
                        />
                    </FormControl>
                </div>
             
               
                {/* <ListBoxP /> */}



            </div>
            </div>

          {
            isShowJoin && (<Box component="fieldset" >
            {/* <legend>Joins</legend> */}

            <div className="container-legent mt-4">
            <div className="new-heading">Joins</div>
            <div className="row mt-2">

       <div className="col-md-6 col-lg-4 mb-3">
        <FormControl>
            {/* <InputLabel>{item.labelName + (item.required ? " *" : "")}</InputLabel> */}
            {/* <InputLabel id="dropdown-label">Select First Table To Join</InputLabel>
            <br /> */}
            <label className="label">First Table To Join</label> 
            <Select
                value={selectedFirstJoinTable}
                onChange={handleJoinTableChange1}
                variant='outlined'
            >
                {tablesJoinsList?.map((i, ind) => (
                    <MenuItem key={i} value={i}>{i}</MenuItem>
                ))}
            </Select>
        </FormControl>
    </div>


    <div className="col-md-6 col-lg-4 mb-3">
        <FormControl>
            {/* <InputLabel>{item.labelName + (item.required ? " *" : "")}</InputLabel> */}
            {/* <InputLabel id="dropdown-label">Second Table To Join</InputLabel>
            <br /> */}
            <label className="label">Second Table To Join</label> 
            <Select
                value={selectedSecondJoinTable}
                onChange={handleJoinTableChange2}
                variant='outlined'
            >
               

{tables?.map((item, index) => {
if (!tablesJoinsList.includes(item.tableName)) {
return <MenuItem key={index} value={item.tableName}>{item.tableName}</MenuItem>;
} else {
return null; // Don't render the MenuItem if it's present in the second list
}
})}

            </Select>
        </FormControl>
    </div>

    {/* <div className="col-md-2">
        <br />
        <Button className="mx-2">
            Go
        </Button>
    </div> */}

<div className="col-md-6 col-lg-4 mb-3">
                    <FormControl>
                        {/* <InputLabel>{item.labelName + (item.required ? " *" : "")}</InputLabel> */}
                        {/* <InputLabel id="dropdown-label">Select First Table's Coulmns To Join</InputLabel>
                        <br /> */}
                        <label className="label">First Table's Coulmns To Join</label>
                        <Select
                            value={selectedFirstJoinCoulmn}
                            variant='outlined'// Assuming default value is the first item's value
                            onChange={handleJoinCoulmnChange1}
                        >
                            {joincoulmns1?.map((i, ind) => (
                                <MenuItem key={joincoulmns1.field} value={i.field}>{i.field}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

               
                <div className="col-md-6 col-lg-4 mb-3">
                    <FormControl>
                        {/* <InputLabel>{item.labelName + (item.required ? " *" : "")}</InputLabel> */}
                        {/* <InputLabel id="dropdown-label">Select Second Table's Coulmns To Join</InputLabel>
                        <br /> */}
                        <label className="label">Second Table's Coulmns To Join</label>
                        <Select
                            value={selectedSecondJoinCoulmn}
                            variant='outlined'// Assuming default value is the first item's value
                            onChange={handleJoinCoulmnChange2}
                        >
                            {joincoulmns2?.map((i, ind) => (
                                <MenuItem key={joincoulmns2.field} value={i.field}>{i.field}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className="col-md-6 col-lg-4 mb-3">
                    <FormControl>
                        {/* <InputLabel>{item.labelName + (item.required ? " *" : "")}</InputLabel> */}
                        {/* <InputLabel id="dropdown-label">Select Type Of Join</InputLabel> */}
                        <label className="label">Select Type Of Join</label>
                        <Select
                            value={selectedJoinType}
                            variant='outlined'
                            onChange={handleJoinTypeChange} // Assuming default value is the first item's value
                        >
                            {joinTypeItems?.map((i, ind) => (
                                <MenuItem key={i.value} value={i.value}>{i.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                

                <div className="col-md-6 col-lg-3"> 
                <div>&nbsp;</div>
                <div>  
                     <Button onClick={addJoinInList}>
                        Add
                    </Button> 
                    </div>
                </div>


                <div className="col-md-12 mt-2">
                    <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                        <th>First</th>
                        <th>Second</th>
                        <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {joinList.map((item, index) => (
                        <tr key={index}>
                            <td>{item.first}</td>
                            <td>{item.second}</td>
                            <td>{item.type}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>


</div>
            </div>  
           
            
        </Box>)
          }  



{
    isShowConditions && (<Box component="fieldset" >

<div className="container-legent mt-4">
            <div className="new-heading">Conditions</div>
            <div className="row mt-2">

    <div className="col-md-4 col-lg-2 mb-3">
            <FormControl>
                {/* <InputLabel>{item.labelName + (item.required ? " *" : "")}</InputLabel> */}
                {/* <InputLabel id="dropdown-label">Select Coulmns</InputLabel> */}
                <label className="label">Select Coulmns</label>
                <Select
                    value={selectedFirstCondtionTable}
                    onChange={handleCondtionFirstTableSection}
                    variant='outlined'
                >
                    {coulmns?.map((i, ind) => (
                        <MenuItem key={i.id} value={i.id}>{i.id}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>


        <div className="col-md-4 col-lg-2 mb-3">
            <FormControl>
                {/* <InputLabel>{item.labelName + (item.required ? " *" : "")}</InputLabel> */}
                {/* <InputLabel id="dropdown-label">Select Operator</InputLabel> */}
                <label className="label">Select Operator</label>
                <Select
                    value={selectedOperator}
                    onChange={handleOperatorChange}
                    variant='outlined'
                >
                   

{conditionsItems?.map((item, index) => {
return <MenuItem key={index} value={item.value}>{item.value}</MenuItem>;

})}

                </Select>
            </FormControl>
        </div>
<div className="col-md-4 col-lg-3 mb-3">


{/* <FormLabel component="legend">Condition Value Type</FormLabel> */}
<label className="label">Condition Value Type</label>
      <RadioGroup
        aria-label="options"
        name="condition_Value_Type"
        // value={selectedOption}
        // onChange={handleChange}
      >
        <div className="d-flex gap-2">
        <FormControlLabel value="txtValue" control={<Radio onChange={displayConditionOption}/>} label="Value" />
        <FormControlLabel value="colValue" control={<Radio onChange={displayConditionOption} />} label="Coulmns" />
        </div>
      </RadioGroup>

</div>

<div className="col-md-4 col-lg-3 mb-3">
{isShowTxtValue && (<FormControl>
                {/* <InputLabel>{item.labelName + (item.required ? " *" : "")}</InputLabel> */}
                {/* <InputLabel id="dropdown-label">Enter Condition Value</InputLabel> */}
                <label className="label">Enter Condition Value</label>

                <TextField
    //   label="Enter Text"
      variant="outlined"
      value={selectedSecondCondtionTable}
      onChange={handleRightChange}
    />
            </FormControl> )}
            {isShowColValue && (<FormControl>
                {/* <InputLabel>{item.labelName + (item.required ? " *" : "")}</InputLabel> */}
                {/* <InputLabel id="dropdown-label">Select Condition Coulmns</InputLabel> */}
                <label className="label">Select Condition Coulmns</label>              
                <Select
                    value={selectedSecondCondtionTable}
                    onChange={handleRightChange}
                    variant='outlined'
                >
                   {coulmns?.map((i, ind) => (
                        <MenuItem key={i.id} value={i.id}>{i.id}</MenuItem>
                    ))}
                </Select>
            </FormControl> )}

</div>        

        <div className="col-md-4 col-lg-2 mb-3"> 
                <div>&nbsp;</div>
                <div>  <Button onClick={addConditionInList}>Add</Button> </div>
        </div>

    </div>


    <div className="row">
        <div className="col-md-12">
            <div className="table-responsive">
            <table className="table table-bordered">
                    <thead>
                    <tr>
                    <th>First</th>
                    <th>Second</th>
                    <th>Type</th>
                    </tr>
                    </thead>
                    <tbody>
                    {conditionList.map((item, index) => (
                    <tr key={index}>
                    <td>{item.first}</td>
                    <td>{item.second}</td>
                    <td>{item.condtionType}</td>
                    </tr>
                    ))}
                    </tbody>
                    </table>
                </div>

        </div>

    </div>


           
</div>
    
    
</Box>)
}  
               
 <div className="col-md-12 mb-3"> 
                    <div>&nbsp;</div>
                    <div style={{textAlign:'end'}}> <Button onClick={generateQuery}> Generate Query</Button>   </div>
            </div>

            <div className="col-md-12"> 
            <span className="queryResult"> {sqlQuery} </span>
            </div>
        </div>




    );
}

export default ProcedureBuilderPage;
