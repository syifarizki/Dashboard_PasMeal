const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <label className="inline-flex items-center cursor-pointer relative">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-10 h-5 bg-gray-500 peer-checked:bg-[#005B96] rounded-full transition-colors duration-300"></div>
      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 transform peer-checked:translate-x-5" />
    </label>
  );
}

export default ToggleSwitch;
