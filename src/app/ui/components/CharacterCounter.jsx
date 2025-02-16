const CharacterCounter = ({ value, maxLength, size, textColor, className }) => {
  return (
    <div className={`${size ? `text-${size}` : `text-base`} text-right text-${textColor ? `${textColor}` : `gray-400`} ${className}`}>
      {value.length}/{maxLength}
    </div>
  );
};

export default CharacterCounter;
