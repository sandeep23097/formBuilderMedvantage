import { Button } from '@mui/material';
import React,{ FC, ReactNode } from 'react';

interface JoinButtonComponentProps {
    setIsShowJoin: (type: boolean) => void;
    isShowJoin: boolean;
}

const JoinButtonComponent: FC<JoinButtonComponentProps> = (props) => {
    const { setIsShowJoin,isShowJoin } = props;

  return (
    <Button  onClick={() => { setIsShowJoin(!isShowJoin);}} style={{marginRight:'10px'}}>
    {isShowJoin ? 'Hide Join' : 'Add Join'} 
 </Button>
  );
};

export default JoinButtonComponent;