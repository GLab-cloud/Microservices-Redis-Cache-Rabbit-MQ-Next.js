'use client'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import {useGoogleLogin} from '@react-oauth/google';
import { useAppData } from "@/context/AppContext";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";


const LoginPage = () => { 
const {isAuth, user, setIsAuth, loading, setLoading} = useAppData();
   if(isAuth){
    // window.location.href = "/dashboard";
    return redirect("/");
   }
  const responseGoogle = async (authResult: any) => {
    // Implementation for Google login
    try {
      const result = await axios.post("https://didactic-memory-5rg959677q624qvx-5000.app.github.dev/api/v1/login", {
        code: authResult['code'],
      });
        Cookies.set("token", result.data.token, { expires: 7,secure: true,path: '/' });
        toast.success(result.data.message);
      } 
      catch (error) {
        console.error("Google login failed:", error);
        toast.error("Google login failed.");
      }
    }
    const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => {
      console.error("Google login error:", error);
      toast.error("Google login failed.");
    },
    flow: 'auth-code',
  });
    return (
   <> 
   {loading? 
   (
   <Loading />
   )
   :(<div className="w-87.5 m-auto mt-10">
      <Card className="w-87.5">
      <CardHeader>
        <CardTitle className="text-2xl">Login to The Reading Retreat</CardTitle>
        <CardDescription>
          Login to your Blog App
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full" onClick={() => googleLogin()}  >
          Login with Google <img src="/google.png" alt="Google Icon" className="w-6 h-6 ml-2" />
        </Button>
      </CardFooter>
    </Card>
    </div>)}
     </>
  )
}

export default LoginPage    