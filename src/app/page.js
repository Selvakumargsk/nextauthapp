"use client"
import Table from "@/components/crudTable";
import { signIn, signOut, useSession } from "next-auth/react"
import Cookies from "js-cookie";

export default function Home() {

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      alert('please signin to continue')
      signIn()
    }
  });

  console.log(session, status);

  if(status == "authenticated" && session){
    const token = session?.token?.token?.user?.token;
    if(token){
      Cookies.set('token' , token);
    }
  }

  const handleSignOut = () => {
    signOut();
  }

  return (
    <>
    <div className="flex justify-between p-5">
      <h2 className="text-center text-[blue] font-bold text-[24px]">homepage</h2>
      <button className="bg-red-500 p-2 font-bold text-[white] mt-2 rounded-md" onClick={handleSignOut}>signOut here</button>
    </div>
      <Table />
    </>
  )
}
