const SectionTitle = ({ sectionName, heading, subHeading }) => {
  return (
    <div className="text-center text-xl font-semibold 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl">
      <h3 className="text-xl font-medium text-primary">{sectionName}</h3>
      <h2 className="font-head my-2 text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl">{heading}</h2>
      <h2 className="text-xl text-white/75 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl">{subHeading}</h2>
    </div>
  );
};

export default SectionTitle;
