import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { LOGIN } from '../services/queries'

const Loginform = ({  setToken }) => {
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')

   const [login, result] = useMutation(LOGIN, {
      onError: (error) => {
         console.log(error.graphQLErrors[0].message)
      }
   })

   useEffect(() => {
      if (result.data) {
         const token = result.data.login.value
         localStorage.setItem('user-token', token)
         setToken(token)
      }
   }, [result.data])

   const handleSubmit = async (e) => {
      e.preventDefault()
      login({ variables: { username, password } })
      setUsername('')
      setPassword('')
   }

   return (
      <div>
         <h2>Login</h2>
         <form onSubmit={handleSubmit}>
            <div>
               username <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
            </div>
            <div>
               password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
            </div>
            <button type='submit'>login</button>
         </form>
      </div>
   )
}

export default Loginform
