import { SignUp } from "@clerk/nextjs"

export default function page() {
  return (
    <div className="flex flex-col h-100">
        <div className="m-auto">
            <SignUp forceRedirectUrl={"user/dashboard"}/>
        </div>
    </div>
  )
}
