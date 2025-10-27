// InputField.jsx
const InputField = ({ value, onChange, placeholder, type = "text" }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="custom-rule-node"
    />
);

export default InputField;