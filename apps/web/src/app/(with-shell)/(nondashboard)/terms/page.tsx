 'use client'
 
 import React from 'react'
 import termsData from '@/data/terms.json'
 
 const TermsOfService = () => {
   const content = termsData.ko
 
   return (
     <div className="flex flex-col justify-center items-center bg-customgreys-primarybg text-white-50 px-6 py-12">
       <div className="max-w-3xl text-center mb-12">
         <h1 className="text-4xl font-extrabold text-primary-700">{content.title}</h1>
         <p className="text-gray-300 mt-4 text-sm md:text-base">
           서비스 이용과 관련된 기본적인 약관을 안내합니다.
         </p>
       </div>
 
       <div className="max-w-4xl bg-customgreys-secondarybg p-8 md:p-12 rounded-xl shadow-lg w-full">
         {content.sections.map((section, idx) => (
           <section className="mb-8" key={idx}>
             <h2 className="text-lg font-semibold text-primary-700 mb-3">{section.title}</h2>
             {section.content.map((line, i) => (
               <p key={i} className="text-sm text-gray-300 leading-relaxed">{line}</p>
             ))}
           </section>
         ))}
       </div>
 
       <footer className="mt-12 text-gray-400 text-xs">
         최종 업데이트일: {content.lastUpdated}
       </footer>
     </div>
   )
 }
 
 export default TermsOfService