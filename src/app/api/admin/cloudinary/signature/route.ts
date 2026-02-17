import { auth } from "@/auth"
import cloudinary from "@/lib/cloudinary"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { paramsToSign } = body

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  )

  return NextResponse.json({ signature })
}
