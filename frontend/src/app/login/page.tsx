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

const LoginPage = () => {
  return (
    <div className="w-87.5 m-auto mt-10">
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
        <Button variant="outline" className="w-full">
          Login with Google <img src="/google.png" alt="Google Icon" className="w-6 h-6 ml-2" />
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}

export default LoginPage    