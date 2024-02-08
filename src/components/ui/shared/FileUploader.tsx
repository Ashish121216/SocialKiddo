import React, {useCallback, useState} from 'react'
import {FileWithPath , useDropzone} from 'react-dropzone'
import { Button } from '../button';

type fileuploaderprops = {
  fieldChange :(FILES : File[]) => void
  mediaUrl:string
}

const FileUploader = ({fieldChange , mediaUrl} :fileuploaderprops) => {

  const [file , setfile] = useState<File[]>([]);
  const [FileUrl , setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback((acceptedFiles : FileWithPath[]) => {
    setfile(acceptedFiles);
    fieldChange(acceptedFiles);
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));
  }, [])
  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept:{
      'image/*' :['.png','.svg','.jpg']
    }
  })

  return (
    <div {...getRootProps()} className='flex flex-col flex-center bg-dark-3 rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer'/>
      {
        FileUrl ?(
          <>
          <div className='flex flex-1 justify-normal w-full p-5 lg:p-10'>
            <img src={FileUrl} 
            alt="image" 
            className='file_uploader-img'
            />
          </div>
          <p className='file_uploader-label'> Click or drag photo to replace</p>
          </>
        ):(
          <div className='file_uploader-box'>
            <img src="/assets/icons/file-upload.svg"
            alt="upload"
            width={95}
            height={95}
            />
            <h3 className='base-medium text-light-2 mb-3 mt-5 '>Drag photo here</h3>
            <p className='text-light-4 small-regular mb-6'>SVG , PNG , JPG</p>
            <Button className='shad-button_dark_4'>Select From Computer</Button>
          </div>
        )
      }
    </div>
  )
}

export default FileUploader
