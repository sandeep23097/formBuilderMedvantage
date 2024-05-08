import React, { ChangeEventHandler, FormEventHandler, FunctionComponent, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addTemplate } from '../../redux/entities/formBuilderEntity';
import { useNavigate } from 'react-router-dom';
import useModalStrip from '../../global-hooks/useModalStrip';
import { TemplateType } from '../../types/FormTemplateTypes';
import ManageItemsListComponentFromQuery from './subcomponents/ManageItemsListComponentFromQuery';

interface QueryBuilderModalComponentProps {
  openDialog: boolean,
  setOpenDialog: (arg: boolean)=>void
  setApiItemData: (arg: object)=>void
  setisSetApiItemData: (arg: object)=>void
}

interface NewFormDataType{
  formName: string
}

const textboxStyle = {
  minWidth: "100%",
  maxWidth: "100%",
  marginTop: "20px",
};
 
const QueryBuilderModalComponent: FunctionComponent<QueryBuilderModalComponentProps> = (props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showModalStrip } = useModalStrip();

  const [creatingForm, setCreatingForm] = useState<boolean>(false);

  const [newFormData, setNewFormData] = useState<NewFormDataType>({
    formName: ''
  });

  const handleInputChange:ChangeEventHandler<HTMLInputElement>  = (e)=>{
    const {name , value} = e.target;
    setNewFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = async (e)=>{
    e.preventDefault();
    if(newFormData.formName === ''){
      showModalStrip("danger", "Form name cannot be empty", 5000);
      return;
    }
    setCreatingForm(true);
    try{
      const template: TemplateType = await dispatch(addTemplate(newFormData)).unwrap();
      navigate(`/formbuilder/${template.id}`);
    } catch(ex){
      showModalStrip("danger", "Error occured while creating a new Form", 5000);
    }
  }

  return (
    <>
      <Dialog
        open={props.openDialog}
        // fullWidth
        // maxWidth="xl"
        sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "1720px",  // Set your width here
              },
            },
          }}
        onClose={() => {
          props.setOpenDialog(false);
        }}
        className='custome-modal'
      >
        <DialogTitle>
          <div className="d-flex align-items-center justify-content-between title">
            <span style={{ padding: "9px", cursor: "pointer" }}>
              <i className="fas fa-arrow-left"></i>
            </span>
            <span
              style={{ padding: "9px", cursor: "pointer" }}
              onClick={() => props.setOpenDialog(false)}
            >
              <i className="fas fa-times"></i>
            </span>
          </div>
        </DialogTitle>
        <DialogContent>
          
                <ManageItemsListComponentFromQuery handleFormSubmit={handleFormSubmit} setApiItemData={props.setApiItemData} setisSetApiItemData={props.setisSetApiItemData}/>

               
        </DialogContent>
      </Dialog>
    </>
  );
}
 
export default QueryBuilderModalComponent;