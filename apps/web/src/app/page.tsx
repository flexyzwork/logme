import { handleGenerateSite } from "@/services/site"

export default async function Home() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <form action={handleGenerateSite} className="flex justify-end mb-6">
        <button
          type="submit"
          className="bg-[#4a5a8a] hover:bg-[#3a4a7a] text-[#e6e6eb] font-bold py-2 px-4 rounded-md shadow-lg transition duration-300"
        >
          Generate Site
        </button>
      </form>
    </div>
  )
}
