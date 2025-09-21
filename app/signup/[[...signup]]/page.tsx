import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex flex-col h-screen">
        <div className="m-auto">
            <SignUp redirectUrl="/user/dashboard"/>
        </div>
    </div>
  )
}
