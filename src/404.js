import React, { useEffect } from 'react'

export default function NotFoundPage() {

    useEffect(() => {
        document.title = "IFAPP | Page not found"
    });

  return (
    <div id='NotFoundPage' className='toCenter'>
        <div>
            <h1>404</h1>
            <p>This page that you trying to access it not found !</p>
        </div>
    </div>
  )
}
