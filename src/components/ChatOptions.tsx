import { useState } from "react";
import Slider from "../ui/Slider";

const ChatOptions = () => {
  const [active, setActive] = useState(false);

  return (
    <>
      <div className="popover-container">
        <button onClick={() => setActive(!active)} className="toggle-button">
          {active ? "Hide Options" : "Show Options"}
        </button>
        {active && (
          <div className="container-chatoptions">
            <Slider />
          </div>
        )}
      </div>
    </>
  );
};

export default ChatOptions;
