// A meta object with type is required for each field module
export const meta = {
  fieldType: "example",
};

// onChange only needs to be passed in with the new value
export default function ExampleField({ value, onChange }) {
  return (
    <div>
      <label>{node.label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
