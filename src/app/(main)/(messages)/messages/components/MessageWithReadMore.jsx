import { useState } from "react";
import LinesEllipsis from "react-lines-ellipsis";

const MessageWithReadMore = ({ text, isEdit }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {!expanded ? (
        <LinesEllipsis
          text={text}
          maxLine="16"
          ellipsis={
            <>
              {"... "}
              <span className="cursor-pointer underline" onClick={() => setExpanded(true)}>
                Read more
              </span>
            </>
          }
          trimRight
          basedOn="letters"
          component="p"
        />
      ) : (
        <div>
          {text} {isEdit && <p className="text-xs">(Edited)</p>}
          <span className="cursor-pointer underline" onClick={() => setExpanded(false)}>
            Read less
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageWithReadMore;
