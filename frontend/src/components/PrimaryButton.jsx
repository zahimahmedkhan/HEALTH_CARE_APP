import React from "react";
import { Button } from "antd";

const PrimaryButton = ({ isLoading, text }) => {
  return (
   <Button
  htmlType="submit"
  block
  loading={isLoading}
  type="default"
  className="relative w-full !h-12 overflow-hidden cursor-pointer text-lg font-semibold hover:!border-2 border-transparent rounded-xl z-10 group !bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 shadow-lg hover:shadow-xl"
>
  <span className="relative z-10 !text-white transition-colors duration-300 group-hover:!text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text">
    {text}
  </span>

  {/* Enhanced slide effect */}
  <span className="absolute top-full left-full w-[200%] h-[400%] bg-white rounded-full z-0 transition-all duration-500 group-hover:top-[-150%] group-hover:left-[-50%]" />
  
  {/* Additional shine effect */}
  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-0" />
</Button>
  );
};

export default PrimaryButton;
