import { useEffect, useState } from "react";

import Signpost from "./Signpost";

function TimeComponent(props) {
    const [counter, setCounter] = useState(props.counter);    
    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    
      });

      return (
        <>
            {counter>0 ? <Signpost counter={counter} /> : null}
        </>
      )
}

export default TimeComponent