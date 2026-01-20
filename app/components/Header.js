import React from 'react'

const Header = () => {
  return (
    <>
    <div className="lg:hidden h-15 border border-b border-slate-200 flex items-center justify-between px-4">
      <div className='flex items-center gap-1'>
        <img src="/logo.png" alt="" className='w-8' />
        <span className='font-bold'>RupeeSplit</span>
      </div>
      <div>
        <img className='w-8' src="/avatar.gif" alt="" />
      </div>
    </div>
    <div className="not-lg:hidden h-15 border border-b border-slate-200 flex items-center justify-between px-4"></div>
    </>
  )
}

export default Header
