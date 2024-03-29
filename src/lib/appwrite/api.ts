import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, appwriteConfig, databases, avatars, storage } from "./config";
import { ID, Query } from "appwrite";
import { array } from "zod";

export async function createUserAccount(user:INewUser){
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);
        
        const newUser = await saveUserToDB({
            accountid:newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username:user.username,
            imageUrl: avatarUrl,
        })
        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }

}

export async function saveUserToDB(user:{
    accountid: string,
    email: string,
    name: string,
    imageUrl: URL,
    username?: string,
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )
        return newUser;
    } catch (error) {
        console.log(error)
    }
}

export async function signInAccount(user : {email:string;password:string}){
    try {
        const session = await account.createEmailSession(user.email,user.password);
        return session;
    } catch (error) {
        console.log(error)
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountid' , currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
         
    } catch (error) {
        console.log(error)
        console.log("get current")
    }
}

export async function signOutAccount(){
    try {
        const session = await account.deleteSession("current")
        return session;
    } catch (error) {
        console.log(error)
    }
}

export async function createPost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
  
      if (!uploadedFile) throw Error;
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageid: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    console.log("file svaed to db");
    return newPost;
  } catch (error) {
    console.log(error);
  }
}
  

export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== GET FILE URL
export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }
  
  // ============================== DELETE FILE
export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
  
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }
  
export async function getrecentposts(){
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc('$createdAt'),Query.limit(20)]
  )
  if(!posts)throw Error;
  return posts;
  }

export async function liked(postId :string ,likesArray:string[]){
    console.log("we are likes function")
    try {
      const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId,
        {likes : likesArray} 
        )
        if(!updatedPost) throw Error;
        return updatedPost;
    } catch (error) {
      console.log(error)
    }

  }

export async function save(postId :string ,userId:string){
    console.log(`postId ${postId},userId${userId}`);
    try {
      const updatedPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        ID.unique(),
        {
        user:userId,
        post:postId,
        
        }
        )
        if(!updatedPost) throw Error;
        return updatedPost;
    } catch (error) {
      console.log(error)
    }

  }

export async function deletesavePost(savedRecordId:string){
  console.log("savedRecordid:",savedRecordId);
    try {
      const statuscode = await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId,
        savedRecordId
        )
        if(!statuscode) throw Error;
        return {statuscode:'ok'};
    } catch (error) {
      console.log(error)
    }

  }

export async function getpostbyid(postId : string){
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    if(!post) throw Error;
    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function UpdatePost(post: IUpdatePost) {
  const hasFiletoUpload = post.file.length > 0;
  try {

    let image = {
        imageUrl : post.imageUrl,
        imageId :post.imageId
    }
    if(hasFiletoUpload){
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;
    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    image = {...image , imageUrl:fileUrl , imageId: uploadedFile.$id}
  }

  // Convert tags into array
  const tags = post.tags?.replace(/ /g, "").split(",") || [];

  // Update post
  const updatedPost = await databases.updateDocument(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    post.postId,
    {
      caption: post.caption,
      imageUrl: image.imageUrl,
      imageid: image.imageUrl,
      location: post.location,
      tags: tags,
    }
  );

  if (!updatedPost) {
    await deleteFile(image.imageId);
    throw Error;
  }
  return updatedPost;
} 
catch (error) {
  console.log(error);
}
}

export async function deletePost(postId :string , imageId:string){
  if(postId || imageId) throw Error;
  try {
      await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    return {status :'ok'};  
  } 
    catch (error) {
    console.log(error);
    
  }
}