import {Routes,Route} from 'react-router-dom'
import './globals.css'
import SigninForm from './_auth/forms/SigninForm'
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages'
import SignupForms from './_auth/forms/SignupForms'
import AuthLayout from './_auth/AuthLayout'
import { Toaster } from './components/ui/toaster'
import RootLayout from './_root/pages/RootLayout'

const App = () => {
  return (
    <main className='flex h-screen'>
        <Routes>
            {/*public Routes */}
            <Route element = {<AuthLayout/>}>
                <Route path = "/sign-in" element= {<SigninForm/>}/>
                <Route path = "/sign-up" element= {<SignupForms/>}/>
            </Route>

            {/*Private Routes */}
            <Route element = {<RootLayout />}>
            <Route index element = {<Home/>} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/all-users" element={<AllUsers />} />
            <Route path="/create-Post" element={<CreatePost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/post-details/:id" element={<PostDetails />} />
            <Route path="/profile/:id" element={<Profile />}/>
            <Route path="/update-profile/:id" element={<UpdateProfile />} />
            </Route>
         </Routes>
         <Toaster />
    </main>
  )
}

export default App
