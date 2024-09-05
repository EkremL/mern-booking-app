const Footer = () => {
  return (
    <div className="bg-indigo-500 py-10 ">
      <div className=" mx-32 flex justify-between items-center">
        <span className="text-3xl text-white font-bold tracking-tight">
          Fantastic Holidays
        </span>
        <span className="text-white font-bold tracking-tight flex gap-4">
          <p className="cursor-pointer">Privacy Policy</p>
          <p className="cursor-pointer">Terms of Service</p>
        </span>
      </div>
    </div>
  );
};

export default Footer;
