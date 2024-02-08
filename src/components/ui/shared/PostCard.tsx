import { useUserContext } from '@/context/AuthContext';
import { formatRelativeTime } from '@/lib/utils';
import { Models } from 'appwrite'
import { Link } from 'react-router-dom';
import PostStates from './PostStates';

type PostCardProps = {
  post: Models.Document;
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  if (!post.creator) return;
  return (
    <div>
      <div className="post-card">
        <div className="flex-between">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.creator.$id}`}>
              <img src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                alt="Userimage"
                className='w-10 h-10 rounded-full' />
            </Link>
            <div className="flex flex-col">
              <p className='text-light-1 base-medium lg:body-bold'>
                {post?.creator?.email}
              </p>
              <div className='flex flex-1 gap-2 text-light-3'>
                <p className='subtle-semibold lg:small-regular'>
                  {formatRelativeTime(post?.$createdAt)}
                </p>
                <p className='subtle-semibold lg:small-regular'>
                  {post.location}
                </p>
              </div>
            </div>
          </div>
          <Link to={`/edit-post/${post.$id}`}
            className={`${user.id !== post.creator.$id && "hidden"}`}>
            <img src="assets/icons/edit.svg" alt="update" />
          </Link>
        </div>
        <Link to={`/posts/${post.$id}`}>
            <div className="small-medium py-5">
              <p>{post.caption}</p>
              <ul className='flex gap-1 mt-2'>
                {post.tags.map((tag : string) => {
                  return(
                    <li key={tag} className='text-light-3'>
                    #{tag}
                  </li>
                  )
                })}
              </ul>
            </div>
            <img src={post.imageUrl || 'assets/icons/profile-plaaceholder.svg'} 
            alt="creator" />
        </Link>
        <PostStates post = {post} userId={user.id}/>
      </div>
    </div>
  )
}

export default PostCard
