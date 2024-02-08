import React from 'react'
import RootLayout from './RootLayout'
import { usegetrecentposts } from '@/lib/react-query/queriesAndMutations'
import Loader from '@/components/ui/shared/loader'
import { Models } from 'appwrite'
import PostCard from '@/components/ui/shared/PostCard'

const Home = () => {
  const {data:posts, isPending:ispostsloading , isError : isErrorPosts} = usegetrecentposts();
  return (
    <div className='flex flex-1'>
      <div className="home-container">
        <div className="home-posts">
          <h3 className="h3-bold md:h2-bold text-left w-full">Home Feed</h3>
          {
            ispostsloading && !posts ? (
              <Loader />
            ):(
              <ul className=' flex flex-col flex-1 gap-9 w-full'>
                {posts?.documents.map((post : Models.Document) => (
                  <li key={post.$id}><PostCard post = {post} /></li>
                ))}
              </ul>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Home
