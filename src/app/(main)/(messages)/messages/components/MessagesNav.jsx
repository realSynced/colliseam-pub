import { CallIcon, OpenMemberListIcon } from "./MessagesIcons";

const MessagesNav = ({ params, recipientInfo }) => {
  return (
    <nav className="row-start-1 flex justify-between border-b border-white/10 px-5 py-[1.13rem] text-white">
      <div>
        <h1 className="text-base font-bold">{params.username}</h1>
        <p className="text-sm font-semibold opacity-75">{recipientInfo?.aboutme?.title || "..."}</p>
      </div>
      <div className="flex items-center gap-4">
        <button>
          <CallIcon size={25} />
        </button>

        <button>
          <OpenMemberListIcon size={25} />
        </button>
      </div>
    </nav>
  );
};

export default MessagesNav;
