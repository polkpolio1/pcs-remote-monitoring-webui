import React from 'react';
import Select from 'react-select';

const SelectedItem = ({ value, options, onChange, title }) => {
    return (
        <div className="item">
            <div>{title}</div>
            <Select
                value={value}
                options={options}
                onChange={onChange}
            />
        </div>
    )
};

export default SelectedItem;