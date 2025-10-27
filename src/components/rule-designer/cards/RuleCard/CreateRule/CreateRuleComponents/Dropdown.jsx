const Dropdown = ({ value, onChange, options }) => (
    <select value={value} onChange={onChange} className="custom-rule-node-choice">
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

export default Dropdown;