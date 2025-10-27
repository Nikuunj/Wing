"use client"
import { useProgram } from "@/hook/useProgram"
import { useQuery } from "@tanstack/react-query"

function MessagePage() {
  const { program, publicKey, connection } = useProgram()

  async function fetchData() {
    if (!connection || !program || !publicKey) return;
    let messages = null;

    try {
      messages = await program.account.donationMessage.all([
        {
          memcmp: {
            offset: 8,
            bytes: publicKey.toBase58()
          }
        }
      ])
    } catch (e) {
      console.warn("No messages for user:", e);
    }
    return messages;
  }
  const { data, isLoading } = useQuery({
    queryKey: ['messages' + publicKey?.toString()],
    queryFn: fetchData
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        Loading...
      </div>
    )
  }
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {JSON.stringify(data)}
    </div>
  )
}

export default MessagePage
