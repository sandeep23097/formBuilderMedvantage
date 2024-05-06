import React, { useCallback, useState } from 'react';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import DualListBox from 'react-dual-listbox';
const options = [
    {
        label: 'Table1.Earth',
        options: [
            { value: 'luna', label: 'Moon' },
        ],
    },
    // {
    //     label: 'Table1.Mars',
    //     options: [
    //         { value: 'phobos', label: 'Phobos' },
    //         { value: 'deimos', label: 'Deimos' },
    //     ],
    // },
    {
        label: 'Table2.Jupiter',
        options: [
            { value: 'io', label: 'Io' },
            { value: 'europa', label: 'Europa' },
            { value: 'ganymede', label: 'Ganymede' },
            { value: 'callisto', label: 'Callisto' },
        ],
    },
];
  const ListBoxP = () => {
    const [selected, setSelected] = useState([]);
    return (
        <DualListBox
            options={options}
            selected={selected}
            onChange={(newValue: React.SetStateAction<never[]>) => setSelected(newValue)}
        />
    );

  };
  
  export default ListBoxP;