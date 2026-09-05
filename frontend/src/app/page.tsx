"use client";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/context/AppContext";
import React from "react";
const Home = () => {
  const {loading}=useAppData();
  return (
    <div className="text-xl text-center text-blue-500 justify-center mt-20"> 
    {
    loading ? <Loading /> : <Button onClick={() => window.location.href = "/login"}>Login Reading Retreat </Button>
     }
    </div>
  ) 
}
export default Home;