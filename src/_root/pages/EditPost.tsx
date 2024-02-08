import PostForm from '@/components/ui/forms/PostForm'
import Loader from '@/components/ui/shared/loader';
import { usegetPostbyId } from '@/lib/react-query/queriesAndMutations';
import React from 'react'
import { useParams } from 'react-router-dom'

const EditPost = () => {
  const {id}  = useParams();
  const {data : post , isPending} = usegetPostbyId(id || '');
  console.log(post);
  return (
    <div className='flex flex-1'>
      <div className="common-container">
        <div className='max-w-5xl flex start gap-3 justify-start w-full'>
          <img src="/assets/icons/add-post.svg" alt="add" width={36} height={36}/>
          <h2 className='h3-bold md:h2-bold text-left 2-full'>Edit Post</h2>
        </div>
        {isPending ? (
          <div><Loader /></div>
        ):(
          <PostForm post={post} />
        )}
      </div>  
    </div>
    
  )
}

export default EditPost
