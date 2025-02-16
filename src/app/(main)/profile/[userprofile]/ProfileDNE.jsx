import Link from "next/link";
import { redirect } from "next/navigation";


export default function ProfileDNE({ user }) {

  if(user === 'undefined') { redirect('/accounts/login')}


  console.log('ProfileDNE ' + user)
  return (
    <div className="flex flex-col justify-center items-center h-screen text-white">
      <h1 className="text-4xl font-bold">Your Profile does not exist.</h1>
      {user ? (
        <>
          <p className="text-lg font-semibold">To create your profile, click the button below.</p>
          <div className="flex space-x-4">
            <button className=" p-2 bg-neutral-300 rounded-lg transition-all duration-150 hover:scale-105">
              <Link href="/accounts/getstarted">Create Profile</Link>
            </button>
            {/* <button className="p-2 bg-neutral-200 rounded-lg transition-all duration-150 hover:scale-105"><Link href={`/profile/${handleSpecificLoad('username')}`}>Visit to your Profile</Link></button> */}
          </div>
        </>
      ) : (
        <p className="text-lg font-semibold">The profile you are looking for does not exist.</p>
      )}
    </div>
  );
}
