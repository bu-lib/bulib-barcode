import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Barcodes() {
    const data = JSON.parse(window.localStorage.getItem("data"))
    console.log(data)
    // console.log(localStorage)
    
    return(
        <div>
            Hello
        </div>
    )
}