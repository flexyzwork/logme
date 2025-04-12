import React from 'react'

const About = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-customgreys-primarybg text-white-50 px-6 py-12">
      {/* Hero Section */}
      <div className="max-w-3xl text-center mb-12 ">
        <h1 className="text-4xl font-extrabold text-primary-700">Logme</h1>
        <p className="text-gray-300 mt-4 text-sm md:text-base">
          Passionate about building technology that simplifies lives, I specialize in developing
          scalable and user-friendly digital experiences.
        </p>
      </div>


      {/* Footer */}
      <footer className="mt-12 text-gray-400 text-xs"></footer>
    </div>
  )
}

export default About
