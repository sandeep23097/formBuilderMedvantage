import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function DynamicTable({ data }) {
  // Extract the first item to use as a reference for column headers
  const columns = data.responseValue.length > 0 ? Object.keys(data.responseValue[0]) : [];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={index}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.responseValue.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>{row[column]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DynamicTable;
