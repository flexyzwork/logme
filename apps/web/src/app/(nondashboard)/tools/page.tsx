import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

const About = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-customgreys-primarybg text-white-50 px-6 py-12">
      {/* Hero Section */}
      <div className="max-w-3xl text-center mb-12 ">
        <h1 className="text-4xl font-extrabold text-primary-700">Flexyz Tools</h1>
        <p className="text-gray-300 mt-4 text-sm md:text-base">
          Passionate about building technology that simplifies lives, I specialize in developing
          scalable and user-friendly digital experiences.
        </p>
      </div>

      {/* Mission, Vision, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mt-12">
        <a
          href="https://logme.flexyz.work"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <Card className="h-full transition-transform hover:scale-[1.02] hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <h2 className="text-lg font-semibold text-primary-700 mb-2">
                🚀 Logme - Blog Builder
              </h2>
              <p className="text-sm text-gray-300">
                To simplify and scale technology, making it accessible to everyone.
              </p>
            </CardContent>
          </Card>
        </a>

        <a
          href="https://page.flexyz.work"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <Card className="h-full transition-transform hover:scale-[1.02] hover:shadow-xl">
            <CardContent className="p-6 text-center">
              <h2 className="text-lg font-semibold text-primary-700 mb-2">
                🌍 Page - Static Publisher
              </h2>
              <p className="text-sm text-gray-300">
                A seamless digital world where technology enhances life effortlessly.
              </p>
            </CardContent>
          </Card>
        </a>

        <Card className="h-full transition-transform hover:scale-[1.02] hover:shadow-xl cursor-default">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-primary-700 mb-2">💡 More....</h2>
            <p className="text-sm text-gray-300">
              Innovation, Integrity, Simplicity, and Continuous Learning.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-400 text-xs"></footer>
    </div>
  )
}

export default About
