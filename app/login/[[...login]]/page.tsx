import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex flex-col h-screen">
        <div className="m-auto">
            <SignIn redirectUrl="/dashboard"/>
        </div>
    </div>
  )
}
