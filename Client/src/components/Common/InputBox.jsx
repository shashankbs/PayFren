import { PropTypes } from "prop-types";
function InputBox({ type, placeholder, value, onChange, id }) {
  return (
    <div className="pt-3">
      <input
        className="border rounded p-3 w-80"
        type={type}
        value={value}
        placeholder={placeholder}
        id={id}
        onChange={(e) => onChange(id, e.target.value)}
      />
    </div>
  );
}

InputBox.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
};

export default InputBox;
