import React from 'react'

const About = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-customgreys-primarybg text-white-50 px-6 py-12">
      {/* Hero Section */}
      <div className="max-w-3xl text-center mb-12">
        <h1 className="text-4xl font-extrabold text-primary-700">Flexyz</h1>
        <p className="text-gray-300 mt-4 text-sm md:text-base">
          일상에 자연스럽게 녹아드는 기술을 만듭니다.
        </p>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-customgreys-secondarybg p-8 md:p-12 rounded-xl shadow-lg max-w-4xl w-full">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
            MY
          </div>
          <h3 className="text-lg font-semibold mt-3">Flexyz</h3>
          <p className="text-xs text-gray-400">Founder & Lead Developer</p>
        </div>

        {/* Bio Section */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-semibold text-primary-700 mb-3">지향하는 방향</h2>
          <p className="text-sm text-gray-300">
            단순하게 만들고, 가볍게 운영하고, 본질에 집중합니다.
            기술은 복잡하더라도, 사용성은 단순해야 한다는 철학을 따릅니다.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-400 text-xs"></footer>
    </div>
  )
}

export default About
