import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableItem from './DraggableItem';
import DraggableTable from './DraggableTable';
import DropArea from './DropArea';
import './QueryBuilder.css'; // Ensure the path is correct

interface Item {
    id: string;
    name: string;
    type: 'table' | 'column';
    tableName?: string;  // Specify the table name if the type is 'column'
}

const QueryBuilder = () => {
  const [selectedTables, setSelectedTables] = useState<Item[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<Item[]>([]);
  const [joins, setJoins] = useState<Item[]>([]);
  const [conditions, setConditions] = useState<Item[]>([]);
  const [sqlQuery, setSqlQuery] = useState<string>('');

  const handleDropTable = (item: Item) => {
    if (!selectedTables.some(table => table.id === item.id)) {
      setSelectedTables([...selectedTables, item]);
    }
  };

  const handleDropColumn = (item: Item) => {
    if (!selectedColumns.some(column => column.id === item.id)) {
      setSelectedColumns([...selectedColumns, item]);
    }
  };

  const handleDropJoin = (item: Item) => {
    setJoins([...joins, item]);
  };

  const handleDropCondition = (item: Item) => {
    setConditions([...conditions, item]);
  };

  const generateQuery = () => {
    let query = 'SELECT ';
    query += selectedColumns.map(col => col.name).join(', ');
    query += ' FROM ';
    query += selectedTables.map(table => table.name).join(', ');

    if (joins.length > 0) {
      joins.forEach(join => {
        query += ` JOIN ${join.name}`;
      });
    }

    if (conditions.length > 0) {
      query += ' WHERE ';
      query += conditions.map(cond => cond.name).join(' AND ');
    }

    setSqlQuery(query);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="queryBuilderContainer">
        <DraggableTable id="1" name="Table 1" />
        <DraggableTable id="2" name="Table 2" />
        <DraggableItem id="1" type="COLUMN" name="Column 1" />
        <DraggableItem id="2" type="COLUMN" name="Column 2" />
        <DropArea type="TABLE" onDrop={handleDropTable}>
          Tables: {selectedTables.map(table => <div key={table.id}>{table.name}</div>)}
        </DropArea>
        <DropArea type="COLUMN" onDrop={handleDropColumn}>
          Columns: {selectedColumns.map(column => <div key={column.id}>{column.name}</div>)}
        </DropArea>
        <DropArea type="JOIN" onDrop={handleDropJoin}>
          Joins: {joins.map(join => <div key={join.id}>{join.name}</div>)}
        </DropArea>
        <DropArea type="CONDITION" onDrop={handleDropCondition}>
          Conditions: {conditions.map(condition => <div key={condition.id}>{condition.name}</div>)}
        </DropArea>
        <button onClick={generateQuery} style={{ marginTop: '20px' }}>Generate SQL Query</button>
        {sqlQuery && <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}>{sqlQuery}</div>}
      </div>
    </DndProvider>
  );
};

export default QueryBuilder;
