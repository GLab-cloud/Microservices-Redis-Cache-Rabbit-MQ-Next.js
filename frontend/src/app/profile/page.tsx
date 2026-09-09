'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppData } from '@/context/AppContext'
import { AvatarImage, Avatar } from '@/components/ui/avatar'
import React from 'react'
const ProfilePage = () => {
    const { user, setUser } = useAppData()
  return (
    <div className='flex items-center justify-center min-h-screen p-4'>
    <Card className='w-full max-w-xl p-6 bg-white rounded-2xl shadow-lg p-6'> 
    <CardHeader className='text-center'>
    <CardTitle className='text-2xl font-semibold'>Profile User: {user?.name}</CardTitle>
        <CardContent className='flex flex-col items-center justify-center space-y-4 mt-4'>
            <Avatar className='w-24 h-24 border-2 border-blue-500 shadow-md cursor-pointer'> 
                <AvatarImage src={user?.image || '/default-avatar.png'} alt='User Avatar' className='w-full h-full rounded-full' />
            </Avatar>       
         </CardContent>
    </CardHeader>
    </Card>    
    </div>
  )
}
export default ProfilePage