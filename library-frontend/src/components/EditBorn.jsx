import { useMutation, useQuery } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import { ALL_AUTHORS, EDIT_BIRTH } from '../services/queries'
import Select from 'react-select';

const EditBorn = () => {
   const result = useQuery(ALL_AUTHORS)
   const [born, setBorn] = useState('')
   const [selectedOption, setSelectedOption] = useState(null);

   const [editBirth] = useMutation(EDIT_BIRTH, {
      refetchQueries: [{query: ALL_AUTHORS}]
   })

   useEffect(() => {
      if (result.data) {
         const options = result.data.allAuthors.map(author => ({
            value: author.name,
            label: author.name
         }));
         setSelectedOption(options[0]);
      }
   }, [result.data]);

   const submit = (e) => {
      e.preventDefault()
      console.log('change....')

      editBirth({
         variables: { name: selectedOption.value, setBorn: parseInt(born) }
      })      
      setBorn('')
   }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit} >
         <Select 
            value={selectedOption}
            onChange={setSelectedOption}
            options={result.data ? result.data.allAuthors.map(author => ({
               value: author.name,
               label: author.name
            })) : []}
         />
        
         <div>
            born <input type="number" value={born} onChange={({target}) => setBorn(target.value)} />
         </div>
         <button type='submit'>update author</button>
      </form>
   </div>
  )
}

export default EditBorn