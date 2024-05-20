import React, { FC, useState,useEffect  } from "react";
import RenderItem from "./RenderItem";
import { FormLayoutComponentsType } from "../../../../types/FormTemplateTypes";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
const previewWindowStyle = {
  backgroundColor: 'white', 
  height: '81vh',
  overflowY:'scroll',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: '9px',
  boxShadow: '0 9px 90px #efefef',
  marginLeft: 'auto',
  marginRight: 'auto'
}

interface StepperFormPreviewProps{
  formLayoutComponents: FormLayoutComponentsType[];
  screenType: string,
  formName: string
}

const StepperFormPreview: FC<StepperFormPreviewProps> = (props)=> {
  const [componentIndex, setComponentIndex] = useState(0);
  const { formLayoutComponents, screenType ,formName} = props;
  const [inputValues, setInputValues] = useState({});
  const component = formLayoutComponents[componentIndex];
  const [tableData, setTableData] = useState([]);
  const [headings, setHeadings] = useState([]);
  const handleInputChange = (id, value) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  };
  const nextPrevIndex = (val: number)=>{
    setComponentIndex((prev)=>prev + val);
  }
  const fetchData = async () => {
    try {
      var url = `http://172.16.61.31:8002/api/${formName}/GetAll${formName}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setTableData(data.responseValue);

      // Assuming data is an array of objects
      if (data.responseValue.length > 0) {
        setHeadings(Object.keys(data.responseValue[0])); // Takes the keys of the first object to use as headings
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
  useEffect(() => {
    

    fetchData();
  }, []);
  const isMobile = screenType === 'mobile';

  return (
    <>
      {formLayoutComponents.length > 0 ? (
        <>
          <div className="m-t-30 p-30">
            <div style={{...previewWindowStyle as any,width: isMobile ? '400px':'initial'}} className="p-20">
              <div className="main-form">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    console.log("ddddddddddd",formName);
                    console.log("eeeeeeeee",inputValues);
                    try {
                      var url = `http://172.16.61.31:8002/api/${formName}/Insert${formName}`;
                      const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(inputValues)
                      });
                      if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                      }
                      const data = await response.json();
                      fetchData();
                   //   setMessage('Data submitted successfully!');
                      console.log(data); // Process your response data further
                    } catch (error) {
                    //  setMessage('Failed to submit data');
                      console.error('There was an error!', error);
                    }


                  }}
                  style={{ minWidth: "100%" }}
                >
                  <div className="text-center border-bottom p-b-10">
                    Step {componentIndex + 1}
                  </div>

                  <div className="my-4">
                    <h4>{component.container.heading}</h4>
                    <p>{component.container.subHeading}</p>
                  </div>

                  {component.children.map((child, ind) => (
                    <div key={child.id} className="my-4">
                      <h5>{child.labelName + (child.required ? " *" : "")}</h5>
                      {child.description !== "" ? (
                        <>
                          <div className="mt-1">
                            <p>{child.description}</p>
                          </div>
                        </>
                      ) : null}
                      <RenderItem key={child.id} item={child} handleInputChange={handleInputChange} />
                      {/* {renderItem(child)} */}
                    </div>
                  ))}

                  {componentIndex !== 0 && (
                    <input
                      type="button"
                      className="btn btn-light btn-shadow m-t-20 m-l-0"
                      value="Back"
                      onClick={() => {
                        nextPrevIndex(-1);
                      }}
                    />
                  )}
                  {componentIndex < formLayoutComponents.length - 1 && (
                    <input
                      type="button"
                      className="btn btn-light btn-shadow m-t-20 m-l-0"
                      value="Next"
                      onClick={() => {
                        nextPrevIndex(1);
                      }}
                    />
                  )}
                  {componentIndex + 1 === formLayoutComponents.length && (
                    <input
                      type="submit"
                      className="btn btn-primary btn-shadow m-t-20 m-r-10"
                      value="Submit"
                      
                    />
                  )}
                </form>
              </div>

              <div className="main-form">
              <TableContainer component={Paper} style={{ marginTop: '20px' }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headings.map((heading, index) => (
              <TableCell key={index} style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                {heading.replace(/_/g, ' ')} {/* Replaces underscores with spaces if any */}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index} hover>
              {headings.map((heading, idx) => (
                <TableCell key={idx}>
                  {row[heading]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
                </div>

            </div>
          </div>
        </>
      ) : (
        <>
          <div className="m-t-30">
            <p>You need to add Containers and Controls to see output here.</p>
          </div>
        </>
      )}
    </>
  );
}

export default StepperFormPreview;
