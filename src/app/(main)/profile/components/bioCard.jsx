"use client";

export default function BioCard({
  name,
  title,
  subtitle,
  bio,
  numFollowers,
  numFollowing,
  nexPoints,
  views,
  reached,
  answers,
  questions,
  skills,
  availability,
  hours,
  topCommunities,
  connections,
  dateCreated,
}) {
  return (
    <div className="h-min w-96 rounded-2xl border border-blackLight">
      <div className={`flex w-96 flex-col gap-5 border border-blackLight rounded-2xl bg-black p-5 text-white`}>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm font-semibold opacity-75">{subtitle}</p>
        </div>
        <div className="flex gap-4">
          <p className="font-semibold text-white">
            {numFollowers} <span className="font-medium opacity-75">Followers</span>
          </p>
          <p className="font-semibold text-white">
            {numFollowing} <span className="font-medium opacity-75">Following</span>
          </p>
        </div>
        <div>
          <h2 className="mb-2 font-semibold">Biography</h2>
          <p className="text-sm font-medium opacity-75">{bio}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="text-sm font-semibold">NexPoints</p>
            <p className="text-sm font-semibold">{nexPoints}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Profile Views</p>
            <p className="text-sm font-semibold">{views}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm font-semibold">Reached</p>
            <p className="text-sm font-semibold">{reached}</p>
          </div>
        </div>
        <div>
          <p className="mb-2 font-semibold">Skills</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div key={index} className="rounded-full bg-blackLight px-4 py-2 text-sm font-bold">
                {skill}
              </div>
            ))}
          </div>
        </div>
        {/* {hours > 0 && (
        <div>
          <p className="font-semibold">Hire {name}</p>
          <div className="flex w-full justify-between rounded-2xl border border-[#ffffff50] py-2 pl-4 pr-2 text-xs">
            <div className="flex flex-col">
              <p className="font-semibold">Open for {availability}</p>
              <p className="font-semibold opacity-75">{hours}h/week</p>
            </div>
            <a href="#" className="rounded-xl bg-blackLight p-2 font-semibold">
              View Portfolio
            </a>
          </div>
        </div>
      )} */}
        {/* <div>
        <p className="font-semibold">Top Communities</p>
        <div className="flex flex-col gap-2">
          {topCommunities.map((community, index) => (
            <div key={index} className="flex items-center gap-2 rounded-2xl border-gray border w-full px-4 py-2 text-xs">
              <img src={community.icon} alt={community.name} className="w-6 rounded-full" />
              <p className="font-semibold">{community.name}</p>
              <p className="font-semibold text-stone-400 ml-auto">{community.numPosts}</p>
            </div>
          ))}
        </div>
      </div> */}
        <div>
          <p className="mb-2 font-semibold">Connections</p>
          <div className="flex flex-col gap-2">
            {connections.map((connection, index) => (
              <a
                key={index}
                href={connection.url}
                className="flex w-full items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${connection.url}`}
                  alt={connection.name}
                  className="w-6 rounded-full"
                />
                <p className="font-semibold">{connection.name}</p>
              </a>
            ))}
          </div>
        </div>
        <time className="mx-auto text-center text-xs font-medium opacity-75">
          {"Joined " +
            new Date(dateCreated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </time>
      </div>
    </div>
  );
}
