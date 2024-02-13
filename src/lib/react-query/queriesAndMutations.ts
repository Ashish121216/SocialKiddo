import {
 useQuery,
 useMutation,
 useQueryClient,
 useInfiniteQuery,
 QueryClient,
} from "@tanstack/react-query"
import { UpdatePost, createPost, createUserAccount, deletePost, deletesavePost, getCurrentUser, getpostbyid, getrecentposts, liked, save, signInAccount, signOutAccount } from "../appwrite/api"
import { INewPost, INewUser, IUpdatePost } from "@/types"
import { QUERY_KEYS } from "./querykey"
import exp from "constants"


export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user:INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user:{
            email:string ; 
            password:string;}) => signInAccount(user)
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
          });
        },
      });
    };

export const usegetrecentposts = () => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
        queryFn:getrecentposts
    })
}

export const uselikedpost = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn  :({postId,likesArray} :{postId:string, likesArray:
            string[]}) => liked(postId , likesArray),
            onSuccess: (data) => {
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_CURRENT_USER]
                })
            }
    })
}

export const usesavespost = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn  :({postId,userId} :{postId:string, userId:
            string}) => save(postId , userId),
            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_CURRENT_USER]
                })
            }
    })
}

export const usedeletesavedpost = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn  :({savedRecordId} :{savedRecordId:string}) =>deletesavePost(savedRecordId),
            onSuccess: () => {

                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey:[QUERY_KEYS.GET_CURRENT_USER]
                })
            }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER],
        queryFn:getCurrentUser
    })
}

export const usegetPostbyId = (postId:string) => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn:() => getpostbyid(postId),
        enabled:!!postId
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(post: IUpdatePost) => UpdatePost(post),
        onSuccess:(data) => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_POST_BY_ID,data?.$id]
            })
        }
    })
}
export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({postId , imageId} : {postId : string, imageId :string}) => deletePost(postId , imageId),
        onSuccess:() => {
            queryClient.invalidateQueries({
                queryKey : [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}