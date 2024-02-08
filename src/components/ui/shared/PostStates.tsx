import { useUserContext } from '@/context/AuthContext'
import { useGetCurrentUser, usedeletesavedpost, uselikedpost, usesavespost } from '@/lib/react-query/queriesAndMutations'
import { checkIsLiked } from '@/lib/utils'
import { Models } from 'appwrite'
import React, { useEffect, useState } from 'react'
import { record } from 'zod'
import Loader from './loader'

type PoststatesProps = {
    post: Models.Document,
    userId:string
}

const PostStates = ({post , userId} : PoststatesProps) => {

    const likesList = post.likes.map((user : Models.Document) => user.$id)
    const [likes , setlikes] = useState(likesList);
    const [issaved , setIsSaved] = useState(false);
    const {mutate : likedPost} = uselikedpost();
    const {mutate : savedPost} = usesavespost();
    const {mutate : deletesavedPost, isPending:deletesavedIsPending} = usedeletesavedpost();
    const {data:currentuser} = useGetCurrentUser();

    const savedPostRecord : string = currentuser?.save.find((record:
        Models.Document) => record.post.$id  === post.$id)?.$id;
    useEffect(() => {
        setIsSaved(savedPostRecord ? true : false)
    },[currentuser])

    const handlelikepost = (e:React.MouseEvent) => {
        e.stopPropagation();
        let newLikes = [...likes];
        const hasliked = newLikes.includes(userId);

        if(hasliked){
            newLikes  = newLikes.filter((id) => {id !== userId})
        }
        else{
            newLikes.push(userId);
        }
        setlikes(newLikes);
        likedPost({postId:post.$id , likesArray:newLikes})
    }
    const handleSavePost = (e:React.MouseEvent) => {
        e.stopPropagation();

        if(savedPostRecord){
            setIsSaved(false);
            deletesavedPost({savedRecordId:savedPostRecord});
            return;
        }
        else{
            savedPost({postId : post.$id , userId});
            setIsSaved(true);
        }
     }

  return (
    <div>
      <div className="flex justify-between items-center z-20">
        <div className="flex gap-2 mr-5">
            <img src={checkIsLiked(likes , userId) 
            ? "assets/icons/liked.svg"
            :"assets/icons/like.svg"} 
            alt="like" 
            width={25}
            height={25}
            onClick={handlelikepost}
            className='cursor-pointer'/>
            <p>{likes.length}</p>
        </div>

        <div className="flex gap-2">
            {deletesavedIsPending ? (
                <Loader />
            ) :(
                <img src={issaved
                    ? "assets/icons/saved.svg"
                    :"assets/icons/save.svg"}  
                    alt="like" 
                    width={25}
                    height={25}
                    onClick={handleSavePost}
                    className='cursor-pointer'/>
            )}
        </div>
      </div>
    </div>
  )
}

export default PostStates
