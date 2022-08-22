import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { useEffect, useRef, useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import * as XLSX from 'xlsx'

import JsBarcode from 'jsbarcode'

export default function Home() {

	var sheetData = {}
	const [hasData, setHasData] = useState(false)
	const [message, setMessage] = useState("Upload an excel file to generate.")
	const [showModal, setShowModal] = useState(false)

	const Header = () => {

		return(
			<div className='relative bg-white overflow-hidden mb-8 shadow-lg py-4'>
				<h1 className='text-5xl text-center font-bold'>
					<span className='text-[#009bde] uppercase'>Bicol</span> <span className='text-[#f37123] uppercase'> University</span> Library
				</h1>
				<h4 className='text-center text-2xl'>Barcode Generator</h4>
			</div>
		)
	}

	const UploadSection = () => {

		const [dragActive, setDragActive] = useState(false)

		const inputRef = useRef(null)

		const handleUpload = (event) => {

			if(event.target.files.length === 0) {
				setMessage("No file selected. Select an excel file to upload")
				setHasData(false)
			}
			else {
				const [file] = event.target.files
				const reader = new FileReader()

				reader.onload = (event) => {
					const bstr = event.target.result
					const wb = XLSX.read(bstr, { type: 'binary'})
					const wsname = wb.SheetNames[0]
					const ws = wb.Sheets[wsname]
					const data = XLSX.utils.sheet_to_json(ws)
					localStorage.setItem("data", JSON.stringify(data))
				}

				reader.readAsBinaryString(file)
			}
		}

		const onButtonClick = (event) => {
			event.preventDefault()

			const fileInput = document.getElementById("file-input")

			if(fileInput.files.length === 0) {
				setMessage("No file selected. Select an excel file to upload")
				setHasData(false)
			}
			else {
				setMessage("File uploaded successfully.")
				setHasData(true)
				setShowModal(true)
			}
			
		}

		return(
			<form className='flex place-content-between'>
				<input type={'file'} id='file-input' onChange={handleUpload} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
				<button type='button' onClick={onButtonClick} className='bg-gray-300 px-4 py-1 border border-gray-900 rounded space-x-1 hover:bg-gray-100'>
					<FeatherIcon icon='upload' className='inline' size={18}/>
					<span>Upload</span>
				</button>
			</form>
		)
	}

	const handleClose = (event) => {
		event.preventDefault()

		setShowModal(false)
	}

	const Barcodes = () => {
		const data = JSON.parse(localStorage.getItem("data"))
		
		const barcodes = []

		for(const [key, value] of data.entries()) {
			barcodes.push(
				<div id={String("barcode-" + key)} className='border border-black pt-1 px-1 w-[192px] h-[96px]'>
					<p className='text-center font-bold leading-none'>BICOL UNIVERSITY</p>
					<p className='text-center text-sm leading-none'> {value["Library Unit"]} </p>
					<img src="preview.png" id="preview" alt="barcodePreview" width={182} className="m-auto"/>
				</div>
			)
		}

		useEffect(() => {
			const data = JSON.parse(localStorage.getItem("data"))
	
			for (let item in data) {
				// var el = document.getElementById("barcode-" + String(item))
				var barcodeSVG = document.getElementById("barcodeSVG")
				
				JsBarcode("#barcodeSVG", data[item]["Code"] + data[item]["Serial Number"],
					{
						background: "#ffffff",
						marginTop: 0,
						marginLeft: 0,
						marginRight: 0,
						height: 50,
						width: 2.5,
						textMargin: 1,
					}
				)
				
				var el = document.querySelector("#barcode-" + String(item) + " img")
				console.log(data[item]["Code"])
				
				barcodeSVG.setAttributeNS(null, 'height', 80)
				barcodeSVG.setAttributeNS(null, 'width', 250)
	
				var img = el
				var xml = new XMLSerializer().serializeToString(barcodeSVG)
				var svg64 = btoa(xml)
				var b64Start = 'data:image/svg+xml;base64,'
				var image64 = b64Start + svg64
				img.src = image64
			}
		})

		return(
			<div className='absolute top-0 left-0 bg-white w-screen h-screen'>
				<div className='flex justify-end px-4 my-2'>
					<button className='px-2 border-2 border-white hover:border-black mx-2' onClick={handleClose}>
						<FeatherIcon icon='x' className='inline' size={18}/>
						Close
					</button>
				</div>
				<div id="barcodes" className='bg-white flex flex-wrap justify-center'>
					{barcodes}
				</div>
			</div>
			
		)
	}

	return (
		<div className=''>
			<Header />
			<div className='lg:w-2/4 sm:w-4/5 bg-white m-auto shadow-lg rounded p-4'>
				<UploadSection />
				<div className='text-xs pt-2 '>
					{ message }
				</div>
			</div>
			{/* {hasData ? <Barcodes/> : ""} */}
			{showModal ? <Barcodes/> : ""}
			<canvas id="canvas" height={"96px"} width={"192px"} className="hidden m-auto"></canvas>
			<svg id="barcodeSVG" className="hidden place-self-center mx-auto mb-4"></svg>
		</div>
  );
}
