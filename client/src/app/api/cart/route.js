import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    const { data } = await axios.get(`${API_URL}/carts`, {
      headers: {
        Cookie: `token-${token}`,
      },
      withCredentials: true,
    });
    return Response.json(data);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.response.data.msg }), {
      status: 500,
    });
  }
}
